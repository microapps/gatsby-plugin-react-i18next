import React from 'react';
import {withPrefix, WrapPageElementBrowserArgs} from 'gatsby';
// @ts-ignore
import browserLang from 'browser-lang';
import {I18NextContext, LANGUAGE_KEY, PageContext, PluginOptions} from '../types';
import i18next, {i18n as I18n} from 'i18next';
import {I18nextProvider} from 'react-i18next';
import {I18nextContext} from '../i18nextContext';

const i18n = i18next.createInstance();

const withI18next = (i18n: I18n, context: I18NextContext) => (children: any) => {
  return (
    <I18nextProvider i18n={i18n}>
      <I18nextContext.Provider value={context}>{children}</I18nextContext.Provider>
    </I18nextProvider>
  );
};

export const wrapPageElement = (
  {element, props}: WrapPageElementBrowserArgs<any, PageContext>,
  {i18nextOptions = {}, redirect = true, siteUrl}: PluginOptions
) => {
  if (!props) return;
  const {pageContext, location} = props;
  const {
    routed,
    language,
    languages,
    originalPath,
    defaultLanguage,
    resources,
    path
  } = pageContext.i18n;
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

  if (!i18n.isInitialized) {
    i18n.init({
      ...i18nextOptions,
      lng: language,
      fallbackLng: defaultLanguage,
      resources,
      react: {
        useSuspense: false
      }
    });
  }

  Object.keys(resources[language]).map((ns) => {
    if (!i18n.hasResourceBundle(language, ns)) {
      i18n.addResourceBundle(language, ns, resources[language][ns]);
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
    siteUrl,
    path
  };

  return withI18next(i18n, context)(element);
};
