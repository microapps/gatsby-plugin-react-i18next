import React from 'react';
import {I18NextContext, PageContext, PluginOptions} from '../types';
import {withPrefix, WrapPageElementBrowserArgs} from 'gatsby';
// @ts-ignore
import browserLang from 'browser-lang';
import {LANGUAGE_KEY} from '../lib/const';
import i18next, {i18n as I18n} from 'i18next';
import {I18nextProvider} from 'react-i18next';
import {Context} from '../lib/context';

const i18n = i18next.createInstance();

const withI18next = (i18n: I18n, context: I18NextContext) => (children: any) => {
  return (
    <I18nextProvider i18n={i18n}>
      <Context.Provider value={context}>{children}</Context.Provider>
    </I18nextProvider>
  );
};

export const wrapPageElement = (
  {element, props}: WrapPageElementBrowserArgs<any, PageContext>,
  {i18nextOptions = {}, autodetect = true}: PluginOptions
) => {
  if (!props) return;
  const {pageContext, location} = props;
  const {routed, language, languages, originalPath, defaultLanguage, resources} = pageContext.i18n;
  const isRedirect = autodetect && !routed;

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
        const newUrl = withPrefix(`/${detected}${originalPath}${queryParams}`);
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

  const context = {routed, language, languages, originalPath, defaultLanguage};

  return withI18next(i18n, context)(element);
};
