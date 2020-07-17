import React from 'react';
import {Helmet as ReactHelmet, HelmetProps} from 'react-helmet';
import {useI18next} from './useI18next';

export const Helmet: React.FC<HelmetProps> = ({children, ...props}) => {
  const {languages, language, originalPath, defaultLanguage, siteUrl = ''} = useI18next();
  const createUrlWithLang = (lng: string) => {
    const url = `${siteUrl}${lng === defaultLanguage ? '' : `/${lng}`}${originalPath}`;
    return url.endsWith('/') ? url : `${url}/`;
  };
  return (
    <ReactHelmet {...props}>
      <html lang={language} />
      <link rel="canonical" href={createUrlWithLang(language)} />
      {languages.map((lng) => (
        <link rel="alternate" key={lng} href={createUrlWithLang(lng)} hrefLang={lng} />
      ))}
      {/* adding a fallback page for unmatched languages */}
      <link rel="alternate" href={createUrlWithLang(defaultLanguage)} hrefLang="x-default" />
      {children}
    </ReactHelmet>
  );
};
