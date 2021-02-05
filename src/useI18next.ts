import {Namespace, useTranslation, UseTranslationOptions} from 'react-i18next';
import {useContext} from 'react';
import {navigate as gatsbyNavigate} from 'gatsby';
import {I18nextContext} from './i18nextContext';
import {NavigateOptions} from '@reach/router';
import {LANGUAGE_KEY} from './types';

declare var __BASE_PATH__: string | undefined;
declare var __PATH_PREFIX__: string | undefined;

export const useI18next = (ns?: Namespace, options?: UseTranslationOptions) => {
  const {i18n, t, ready} = useTranslation(ns, options);
  const context = useContext(I18nextContext);

  const {routed, defaultLanguage, generateDefaultLanguagePage} = context;

  const getLanguagePath = (language: string) => {
    return generateDefaultLanguagePage || language !== defaultLanguage ? `/${language}` : '';
  };

  const removePrefix = (pathname: string) => {
    const base = typeof __BASE_PATH__ !== `undefined` ? __BASE_PATH__ : __PATH_PREFIX__;
    if (base && pathname.indexOf(base) === 0) {
      pathname = pathname.slice(base.length);
    }
    return pathname;
  };

  const removeLocalePart = (pathname: string) => {
    if (!routed) return pathname;
    const i = pathname.indexOf(`/`, 1);
    return pathname.substring(i);
  };

  const navigate = (to: string, options?: NavigateOptions<{}>) => {
    const languagePath = getLanguagePath(context.language);
    const link = routed ? `${languagePath}${to}` : `${to}`;
    return gatsbyNavigate(link, options);
  };

  const changeLanguage = (language: string, to?: string, options?: NavigateOptions<{}>) => {
    const languagePath = getLanguagePath(language);
    const pathname = to || removeLocalePart(removePrefix(window.location.pathname));
    const link = `${languagePath}${pathname}${window.location.search}`;
    localStorage.setItem(LANGUAGE_KEY, language);
    return gatsbyNavigate(link, options);
  };

  return {
    ...context,
    i18n,
    t,
    ready,
    navigate,
    changeLanguage
  };
};
