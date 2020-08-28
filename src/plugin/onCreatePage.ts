import _glob from 'glob';
import {CreatePageArgs, Page} from 'gatsby';
import BP from 'bluebird';
import fs from 'fs';
import util from 'util';
import {match} from 'path-to-regexp';
import {PageContext, PageOptions, PluginOptions, Resources} from '../types';

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
  const {defaultLanguage = 'en', languages = ['en'], pages = []} = pluginOptions;

  type GeneratePageParams = {
    language: string;
    path?: string;
    originalPath?: string;
    routed?: boolean;
    pageOptions?: PageOptions;
  };
  const generatePage = async ({
    language,
    path = page.path,
    originalPath = page.path,
    routed = false,
    pageOptions
  }: GeneratePageParams): Promise<Page<PageContext>> => {
    const resources = await getResources(pluginOptions.path, language);
    return {
      ...page,
      path,
      context: {
        ...page.context,
        language,
        i18n: {
          language,
          languages: pageOptions?.languages || languages,
          defaultLanguage,
          routed,
          resources,
          originalPath,
          path
        }
      }
    };
  };

  const pageOptions = pages.find((opt) => match(opt.matchPath)(page.path));

  let newPage;
  let alternativeLanguages = languages.filter((lng) => lng !== defaultLanguage);

  if (pageOptions?.excludeLanguages) {
    alternativeLanguages = alternativeLanguages.filter(
      (lng) => !pageOptions?.excludeLanguages?.includes(lng)
    );
  }

  if (pageOptions?.languages) {
    alternativeLanguages = pageOptions.languages.filter((lng) => lng !== defaultLanguage);
  }

  if (pageOptions?.getLanguageFromPath) {
    const result = match<{lang: string}>(pageOptions.matchPath)(page.path);
    if (!result) return;
    const language = languages.find((lng) => lng === result.params.lang) || defaultLanguage;
    const originalPath = page.path.replace(`/${language}`, '');
    const routed = Boolean(result.params.lang);
    newPage = await generatePage({language, originalPath, routed, pageOptions});
    if (routed || !pageOptions.excludeLanguages) {
      alternativeLanguages = [];
    }
  } else {
    newPage = await generatePage({language: defaultLanguage, pageOptions});
  }

  try {
    deletePage(page);
  } catch {}
  createPage(newPage);

  await BP.map(alternativeLanguages, async (lng) => {
    const localePage = await generatePage({
      language: lng,
      path: `${lng}${page.path}`,
      routed: true
    });
    const regexp = new RegExp('/404/?$');
    if (regexp.test(localePage.path)) {
      localePage.matchPath = `/${lng}/*`;
    }
    createPage(localePage);
  });
};
