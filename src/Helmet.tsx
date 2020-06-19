import React from 'react';
import {Helmet as ReactHelmet, HelmetProps} from 'react-helmet';
import {useI18next} from './useI18next';

export const Helmet: React.FC<HelmetProps> = ({children, ...props}) => {
  const {languages, language, originalPath, siteUrl = ''} = useI18next();
  return (
    <ReactHelmet {...props}>
      <html lang={language} />
      <link rel="canonical" href={`${siteUrl}/${language}${originalPath}`} />
      {languages.map((lang) => (
        <link
          rel="alternate"
          key={lang}
          href={`${siteUrl}/${lang}${originalPath}`}
          hrefLang={lang}
        />
      ))}
      {children}
    </ReactHelmet>
  );
};
