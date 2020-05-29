import React from 'react';
import {Helmet as ReactHelmet, HelmetProps} from 'react-helmet';
import {useI18next} from './useI18next';

export const Helmet: React.FC<HelmetProps> = ({children, ...props}) => {
  const {languages, language, originalPath, siteUrl} = useI18next();
  return (
    <ReactHelmet {...props}>
      <html lang={language} />
      <link rel="canonical" href={`${siteUrl}${originalPath}`} />
      {languages.map((lang) => {
        if (lang === language) return null;
        return <link rel="alternate" href={`${siteUrl}/${lang}${originalPath}`} hrefLang={lang} />;
      })}
      {children}
    </ReactHelmet>
  );
};
