import React, {useContext} from 'react';
import {Context} from './context';
import {Link as GatsbyLink, GatsbyLinkProps} from 'gatsby';
import {LANGUAGE_KEY} from './const';

type Props = GatsbyLinkProps<any> & {language?: string};

export const Link: React.FC<Props> = ({language, to, onClick, ...rest}) => {
  const context = useContext(Context);
  const languageLink = language || context.language;
  const link = context.routed || language ? `/${languageLink}${to}` : `${to}`;

  return (
    // @ts-ignore
    <GatsbyLink
      {...rest}
      to={link}
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
};
