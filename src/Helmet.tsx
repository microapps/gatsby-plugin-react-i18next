import React from 'react';
import {Helmet as ReactHelmet, HelmetProps} from 'react-helmet';
import {useI18next} from './useI18next';

export const Helmet: React.FC<HelmetProps> = ({children, ...props}) => {
  const {languages, language, originalPath, defaultLanguage, siteUrl = ''} = useI18next();
  const createUrlWithLang = (lng: string) => {
    return `${siteUrl}${lng === defaultLanguage ? '' : `/${lng}`}${originalPath}`;
  };
  return (
    <ReactHelmet {...props}>
      <html lang={language} />
      <link rel="canonical" href={createUrlWithLang(language)} />
      {languages
        .filter((lng) => lng !== language)
        .map((lng) => (
          <link rel="alternate" key={lng} href={createUrlWithLang(lng)} hrefLang={lng} />
        ))}
      {children}
    </ReactHelmet>
  );
};
