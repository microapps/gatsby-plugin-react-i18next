import {InitOptions} from 'i18next';

export type PluginOptions = {
  languages: string[];
  defaultLanguage: string;
  path: string;
  redirect: boolean;
  i18nextOptions: InitOptions;
};

export type Resources = Record<string, Record<string, Record<string, string>>>;

export type I18NextContext = {
  language: string;
  routed: boolean;
  languages: string[];
  defaultLanguage: string;
  originalPath: string;
  path: string;
};

export type PageContext = {
  path: string;
  i18n: I18NextContext & {resources: Resources};
};
