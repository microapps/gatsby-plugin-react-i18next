import React from 'react';
import {I18NextContext} from '../types';

export const Context = React.createContext<I18NextContext>({
  language: 'en',
  languages: ['en'],
  routed: false,
  defaultLanguage: 'en',
  originalPath: '/'
});
