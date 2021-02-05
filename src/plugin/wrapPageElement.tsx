import React from 'react';
import {withPrefix, WrapPageElementBrowserArgs} from 'gatsby';
// @ts-ignore
import browserLang from 'browser-lang';
import {I18NextContext, LANGUAGE_KEY, PageContext, PluginOptions, LocaleNode} from '../types';
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

export const wrapPageElement = (
  {element, props}: WrapPageElementBrowserArgs<any, PageContext>,
  {
    i18nextOptions = {},
    redirect = true,
    generateDefaultLanguagePage = false,
    siteUrl,
    localeJsonNodeName = 'locales'
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
          fallback: language
        });

      if (!languages.includes(detected)) {
        detected = language;
      }

      window.localStorage.setItem(LANGUAGE_KEY, detected);

      if (detected !== defaultLanguage) {
        const queryParams = search || '';
        const newUrl = withPrefix(`/${detected}${location.pathname}${queryParams}${location.hash}`);
        window.location.replace(newUrl);
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
          ${localeJsonNodeName}: allLocale(language: {eq: $language}}) {
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
  let defaultNS = i18nextOptions.defaultNS || 'translation';
  defaultNS = namespaces.find((ns) => ns !== defaultNS) || defaultNS;
  const fallbackNS = namespaces.filter((ns) => ns !== defaultNS);

  const i18n = i18next.createInstance();

  i18n.init({
    ...i18nextOptions,
    lng: language,
    fallbackLng: defaultLanguage,
    defaultNS,
    fallbackNS,
    react: {
      useSuspense: false
    }
  });

  localeNodes.forEach(({node}) => {
    const parsedData = JSON.parse(node.data);
    i18n.addResourceBundle(node.language, node.ns, parsedData);
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
