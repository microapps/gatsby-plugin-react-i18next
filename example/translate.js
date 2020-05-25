const AWS = require('aws-sdk');
const BP = require('bluebird');
const fs = require('fs');
const util = require('util');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const {languages, defaultLanguage} = require('./languages');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const write = async (path, content) => {
  await mkdirp(getDirName(path));
  return writeFile(path, JSON.stringify(content, null, 2), 'utf8');
};

AWS.config.region = process.env.REGION || 'us-east-1';
const translate = new AWS.Translate();

async function main() {
  const data = await readFile(`locales/${defaultLanguage}/translation.json`, 'utf8');
  const translations = JSON.parse(data);

  const resultMap = {};
  await BP.map(
    languages,
    async (lng) => {
      if (lng === defaultLanguage) return;
      try {
        const localeData = await readFile(`locales/${lng}/translation.json`, 'utf8');
        resultMap[lng] = JSON.parse(localeData);
      } catch (error) {
        resultMap[lng] = {};
      }
      await BP.map(
        Object.keys(translations),
        async (key) => {
          if (key === '_t' || resultMap[lng][key]) return;
          const {TranslatedText} = await translate
            .translateText({
              Text: translations[key],
              SourceLanguageCode: defaultLanguage,
              TargetLanguageCode: lng
            })
            .promise();
          resultMap[lng][key] = TranslatedText;
        },
        {concurrency: 10}
      );
      console.log(`Translated: ${lng}`);
    },
    {concurrency: 10}
  );

  BP.map(Object.keys(resultMap), async (lng) => {
    return write(`locales/${lng}/translation.json`, resultMap[lng]);
  });

  console.log('All done!');
}

main();
