import {CreatePageArgs, Page} from 'gatsby';
import BP from 'bluebird';
import {match} from 'path-to-regexp';
import {PageContext, PageOptions, PluginOptions} from '../types';

export const onCreatePage = async (
  {page, actions}: CreatePageArgs<PageContext>,
  pluginOptions: PluginOptions
) => {
  //Exit if the page has already been processed.
  if (typeof page.context.i18n === 'object') {
    return;
  }

  const {createPage, deletePage} = actions;
  const {
    defaultLanguage = 'en',
    generateDefaultLanguagePage = false,
    languages = ['en'],
    pages = []
  } = pluginOptions;

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
          generateDefaultLanguagePage,
          routed,
          originalPath,
          path
        }
      }
    };
  };

  const pageOptions = pages.find((opt) => match(opt.matchPath)(page.path));

  let newPage;
  let alternativeLanguages = generateDefaultLanguagePage
    ? languages
    : languages.filter((lng) => lng !== defaultLanguage);

  if (pageOptions?.excludeLanguages) {
    alternativeLanguages = alternativeLanguages.filter(
      (lng) => !pageOptions?.excludeLanguages?.includes(lng)
    );
  }

  if (pageOptions?.languages) {
    alternativeLanguages = generateDefaultLanguagePage
      ? pageOptions.languages
      : pageOptions.languages.filter((lng) => lng !== defaultLanguage);
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
