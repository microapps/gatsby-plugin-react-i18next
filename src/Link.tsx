import React, {useContext} from 'react';
import {I18nextContext} from './i18nextContext';
import {Link as GatsbyLink, GatsbyLinkProps} from 'gatsby';
import {LANGUAGE_KEY} from './types';

type Props = GatsbyLinkProps<any> & {language?: string};

export const Link = React.forwardRef<HTMLAnchorElement, Props>(
  ({language, to, onClick, ...rest}, ref) => {
    const context = useContext(I18nextContext);
    const urlLanguage = language || context.language;
    const getLanguagePath = (language: string) => {
      return context.generateDefaultLanguagePage || language !== context.defaultLanguage
        ? `/${language}`
        : '';
    };
    const link = `${getLanguagePath(urlLanguage)}${to}`;

    return (
      // @ts-ignore
      <GatsbyLink
        {...rest}
        to={link}
        innerRef={ref}
        hrefLang={urlLanguage}
        onClick={(e) => {
          if (language) {
            localStorage.setItem(LANGUAGE_KEY, language);
          }
          if (onClick) {
            onClick(e);
          }
        }}
      />
    );
  }
);
