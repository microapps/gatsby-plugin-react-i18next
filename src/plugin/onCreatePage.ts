import _glob from 'glob';
import {CreatePageArgs, Page} from 'gatsby';
import BP from 'bluebird';
import fs from 'fs';
import util from 'util';
import {PageContext, PluginOptions, Resources} from '../types';

const readFile = util.promisify(fs.readFile);
const glob = util.promisify(_glob);

const getResources = async (path: string, language: string) => {
  const files = await glob(`${path}/${language}/*.json`);
  return BP.reduce<string, Resources>(
    files,
    async (result, file) => {
      const [, ns] = /[\/(\w+)]+\/(\w+)\.json/.exec(file)!;
      const content = await readFile(file, 'utf8');
      result[language][ns] = JSON.parse(content);
      return result;
    },
    {[language]: {}}
  );
};

export const onCreatePage = async (
  {page, actions}: CreatePageArgs<PageContext>,
  pluginOptions: PluginOptions
) => {
  //Exit if the page has already been processed.
  if (typeof page.context.i18n === 'object') {
    return;
  }

  const {createPage, deletePage} = actions;
  const {defaultLanguage = 'en', languages = ['en'], path} = pluginOptions;

  const generatePage = async (language: string, routed = false): Promise<Page<PageContext>> => {
    const resources = await getResources(path, language);
    const newPath = routed ? `${language}${page.path}` : page.path;
    return {
      ...page,
      path: newPath,
      context: {
        ...page.context,
        language,
        i18n: {
          language,
          languages,
          defaultLanguage,
          routed,
          resources,
          originalPath: page.path,
          path: newPath
        }
      }
    };
  };

  const newPage = await generatePage(defaultLanguage);
  try {
    deletePage(page);
  } catch {}
  createPage(newPage);

  await BP.map(languages, async (lng) => {
    if (lng === defaultLanguage) return;
    const localePage = await generatePage(lng, true);
    const regexp = new RegExp('/404/?$');
    if (regexp.test(localePage.path)) {
      localePage.matchPath = `/${lng}/*`;
    }
    createPage(localePage);
  });
};
