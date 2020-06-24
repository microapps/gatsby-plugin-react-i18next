import React from 'react';
import {Helmet as ReactHelmet, HelmetProps} from 'react-helmet';
import {useI18next} from './useI18next';

export const Helmet: React.FC<HelmetProps> = ({children, ...props}) => {
  const {languages, language, originalPath, defaultLanguage, siteUrl = ''} = useI18next();
  const createUrlWithLang = (lang: string) =>
    `${siteUrl}${lang === defaultLanguage ? '' : `/${lang}`}${originalPath}`;
  return (
    <ReactHelmet {...props}>
      <html lang={language} />
      <link rel="canonical" href={createUrlWithLang(language)} />
      {languages.map((lang) => (
        <link rel="alternate" key={lang} href={createUrlWithLang(lang)} hrefLang={lang} />
      ))}
      {children}
    </ReactHelmet>
  );
};
