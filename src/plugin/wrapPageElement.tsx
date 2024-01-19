import React from 'react';
import {withPrefix, WrapPageElementBrowserArgs} from 'gatsby';
// @ts-ignore
import browserLang from 'browser-lang';
import {
  I18NextContext,
  LANGUAGE_KEY,
  PageContext,
  PluginOptions,
  LocaleNode,
  Resource,
  ResourceKey
} from '../types';
import i18next, {i18n as I18n} from 'i18next';
import {I18nextProvider} from 'react-i18next';
import {I18nextContext} from '../i18nextContext';
import outdent from 'outdent';

const withI18next = (i18n: I18n, context: I18NextContext) => (children: any) => {
  return (
    <I18nextProvider i18n={i18n}>
      <I18nextContext.Provider value={context}>{children}</I18nextContext.Provider>
    </I18nextProvider>
  );
};

const removePathPrefix = (pathname: string, stripTrailingSlash: boolean) => {
  const pathPrefix = withPrefix('/');
  let result = pathname;

  if (pathname.startsWith(pathPrefix)) {
    result = pathname.replace(pathPrefix, '/');
  }

  if (stripTrailingSlash && result.endsWith('/')) {
    return result.slice(0, -1);
  }

  return result;
};

export const wrapPageElement = (
  {element, props}: WrapPageElementBrowserArgs<any, PageContext>,
  {
    i18nextOptions = {},
    redirect = true,
    generateDefaultLanguagePage = false,
    siteUrl,
    localeJsonNodeName = 'locales',
    fallbackLanguage,
    trailingSlash
  }: PluginOptions
) => {
  if (!props) return;
  const {data, pageContext, location} = props;
  const {routed, language, languages, originalPath, defaultLanguage, path} = pageContext.i18n;
  const isRedirect = redirect && !routed;

  if (isRedirect) {
    const {search} = location;

    // Skip build, Browsers only
    if (typeof window !== 'undefined') {
      let detected =
        window.localStorage.getItem(LANGUAGE_KEY) ||
        browserLang({
          languages,
          fallback: fallbackLanguage || language
        });

      if (!languages.includes(detected)) {
        detected = language;
      }

      window.localStorage.setItem(LANGUAGE_KEY, detected);

      if (detected !== defaultLanguage) {
        const queryParams = search || '';
        const stripTrailingSlash = trailingSlash === 'never';
        const newUrl = withPrefix(
          `/${detected}${removePathPrefix(location.pathname, stripTrailingSlash)}${queryParams}${
            location.hash
          }`
        );
        // @ts-ignore
        window.___replace(newUrl);
        return null;
      }
    }
  }

  const localeNodes: Array<{node: LocaleNode}> = data?.[localeJsonNodeName]?.edges || [];

  if (languages.length > 1 && localeNodes.length === 0 && process.env.NODE_ENV === 'development') {
    console.error(
      outdent`
      No translations were found in "${localeJsonNodeName}" key for "${originalPath}". 
      You need to add a graphql query to every page like this:
      
      export const query = graphql\`
        query($language: String!) {
          ${localeJsonNodeName}: allLocale(filter: {language: {eq: $language}}) {
            edges {
              node {
                ns
                data
                language
              }
            }
          }
        }
      \`;
      `
    );
  }

  const namespaces = localeNodes.map(({node}) => node.ns);

  // We want to set default namespace to a page namespace if it exists
  // and use other namespaces as fallback
  // this way you dont need to specify namespaces in pages
  let defaultNS = i18nextOptions.defaultNS?.toString() || 'translation';
  defaultNS = namespaces.find((ns) => ns !== defaultNS) || defaultNS;
  const fallbackNS = namespaces.filter((ns) => ns !== defaultNS);

  const resources: Resource = localeNodes.reduce<Resource>((res: Resource, {node}) => {
    const parsedData: ResourceKey =
      typeof node.data === 'object' ? node.data : JSON.parse(node.data);

    if (!(node.language in res)) res[node.language] = {};

    res[node.language][node.ns || defaultNS] = parsedData;

    return res;
  }, {});

  const i18n = i18next.createInstance();

  i18n.init({
    ...i18nextOptions,
    resources,
    lng: language,
    fallbackLng: defaultLanguage,
    defaultNS,
    fallbackNS,
    react: {
      ...i18nextOptions.react,
      useSuspense: false
    }
  });

  if (i18n.language !== language) {
    i18n.changeLanguage(language);
  }

  const context = {
    routed,
    language,
    languages,
    originalPath,
    defaultLanguage,
    generateDefaultLanguagePage,
    siteUrl,
    path
  };

  return withI18next(i18n, context)(element);
};
