import React from 'react';
import {I18NextContext} from './types';

export const I18nextContext = React.createContext<I18NextContext>({
  language: 'en',
  languages: ['en'],
  routed: false,
  defaultLanguage: 'en',
  generateDefaultLanguagePage: false,
  originalPath: '/',
  path: '/'
});
