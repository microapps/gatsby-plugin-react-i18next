# gatsby-plugin-react-i18next

Easily translate your Gatsby website into multiple languages.

## Features

- Seamless integration with [react-i18next](https://react.i18next.com/) - a powerful internationalization framework for React.
- Code splitting. Load translations for each page separately.
- Automatic redirection based on the user's preferred language in browser provided by [browser-lang](https://github.com/wiziple/browser-lang).
- Support multi-language url routes in a single page component. You don't have to create separate pages such as `pages/en/index.js` or `pages/es/index.js`.
- SEO friendly
- Support for [gatsby-plugin-layout](https://www.gatsbyjs.org/packages/gatsby-plugin-layout/)

## Why?

When you build multilingual sites, Google recommends using different URLs for each language version of a page rather than using cookies or browser settings to adjust the content language on the page. [(read more)](https://support.google.com/webmasters/answer/182192?hl=en&ref_topic=2370587)

## :boom: Breaking change since v2.0.0

As of V2.0.0, this plugin only supports Gatsby 4.16.0+ and React 18+.

## :boom: Breaking change since v1.0.0

As of v1.0.0, language JSON resources should be loaded by `gatsby-source-filesystem` plugin and then fetched by GraphQL query. It enables incremental build and hot-reload as language JSON files change.

Users who have loaded language JSON files using `path` option will be affected. Please check configuration example on below.

## Demo

- [View demo online](https://kind-lichterman-5edcb4.netlify.app/)
- [Source code](/example)

## Used by

- [monei.com](https://monei.com/) - The digital payment gateway with best rates.
- [moonmail.io](https://moonmail.io/) - OmniChannel Communication Platform used by more than 100,000 businesses worldwide.
- [nyxo.app](https://nyxo.app) – Sleep tracking and coaching [(source code)](https://github.com/hello-nyxo/nyxo-website)

### Tutorials

- [Best internationalization for Gatsby](https://dev.to/adrai/best-internationalization-for-gatsby-mkf) by Adriano Raiano

## How to use

### Install package

```
yarn add gatsby-plugin-react-i18next i18next react-i18next
```

or

```
npm install --save gatsby-plugin-react-i18next i18next react-i18next
```

### Configure the plugin

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/locales`,
      name: `locale`
    }
  },
  {
    resolve: `gatsby-plugin-react-i18next`,
    options: {
      localeJsonSourceName: `locale`, // name given to `gatsby-source-filesystem` plugin.
      languages: [`en`, `es`, `de`],
      defaultLanguage: `en`,
      // if you are using Head, you must include siteUrl, and make sure you add http:https
      siteUrl: `https://example.com`,
      // if you are using trailingSlash gatsby config include it here, as well (the default is 'always')
      trailingSlash: 'always',
      // you can pass any i18next options
      i18nextOptions: {
        interpolation: {
          escapeValue: false // not needed for react as it escapes by default
        },
        keySeparator: false,
        nsSeparator: false
      },
      pages: [
        {
          matchPath: '/:lang?/blog/:uid',
          getLanguageFromPath: true,
          excludeLanguages: ['es']
        },
        {
          matchPath: '/preview',
          languages: ['en']
        }
      ]
    }
  }
];
```

This example is not using semantic keys instead the entire message will be used as a key. [Read more](https://www.i18next.com/principles/fallback#key-fallback).

**NOTE:** If you want nested translation keys do not set `keySeparator: false`. [More configuration options](https://www.i18next.com/overview/configuration-options).

### You'll also need to add language JSON resources to the project.

For example,

| language resource files                                                                                                      | language |
| ---------------------------------------------------------------------------------------------------------------------------- | -------- |
| [/locales/en/index.json](https://github.com/microapps/gatsby-plugin-react-i18next/blob/master/example/locales/en/index.json) | English  |
| [/locales/es/index.json](https://github.com/microapps/gatsby-plugin-react-i18next/blob/master/example/locales/es/index.json) | Spanish  |
| [/locales/de/index.json](https://github.com/microapps/gatsby-plugin-react-i18next/blob/master/example/locales/de/index.json) | German   |

You can use different namespaces to organize your translations. Use the following file structure:

```
|-- language
   |-- namespace.json
```

For example:

```
|-- en
    |-- common.json
    |-- index.json
```

The default namespace is `translation`. [Read more about i18next namespaces](https://www.i18next.com/principles/namespaces)

### Change your components

Use react i18next [`useTranslation`](https://react.i18next.com/latest/usetranslation-hook) react hook and [`Trans`](https://react.i18next.com/latest/trans-component) component to translate your pages.

`gatsby-plugin-react-i18next` exposes all [`react-i18next`](https://react.i18next.com/) methods and components.

Replace [Gatsby `Link`](https://www.gatsbyjs.org/docs/gatsby-link) component with the `Link` component exported from `gatsby-plugin-react-i18next`

```javascript
import {graphql} from 'gatsby';
import React from 'react';
import {Link, Trans, useTranslation} from 'gatsby-plugin-react-i18next';
import Layout from '../components/layout';
import Image from '../components/image';
import SEO from '../components/seo';

const IndexPage = () => {
  const {t} = useTranslation();
  return (
    <Layout>
      <SEO title={t('Home')} />
      <h1>
        <Trans>Hi people</Trans>
      </h1>
      <p>
        <Trans>Welcome to your new Gatsby site.</Trans>
      </p>
      <p>
        <Trans>Now go build something great.</Trans>
      </p>
      <div style={{maxWidth: `300px`, marginBottom: `1.45rem`}}>
        <Image />
      </div>
      <Link to="/page-2/">
        <Trans>Go to page 2</Trans>
      </Link>
    </Layout>
  );
};

export default IndexPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
```

and in `locales/en/translations.json` you will have

```json
{
  "Home": "Home",
  "Hi people": "Hi people",
  "Welcome to your new Gatsby site.": "Welcome to your new Gatsby site.",
  "Now go build something great.": "Now go build something great.",
  "Go to page 2": "Go to page 2"
}
```

This example is not using semantic keys instead the entire message will be used as a key. [Read more](https://www.i18next.com/principles/fallback#key-fallback).

### Changing the language

`gatsby-plugin-react-i18next` exposes `useI18next` hook

```javascript
import {Link, useI18next} from 'gatsby-plugin-react-i18next';
import React from 'react';

const Header = ({siteTitle}) => {
  const {languages, changeLanguage} = useI18next();
  return (
    <header className="main-header">
      <h1 style={{margin: 0}}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`
          }}>
          {siteTitle}
        </Link>
      </h1>
      <ul className="languages">
        {languages.map((lng) => (
          <li key={lng}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                changeLanguage(lng);
              }}>
              {lng}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
};
```

Or a more SEO friendly version using `Link` component

```javascript
import {Link, useI18next} from 'gatsby-plugin-react-i18next';
import PropTypes from 'prop-types';
import React from 'react';

const Header = ({siteTitle}) => {
  const {languages, originalPath} = useI18next();
  return (
    <header className="main-header">
      <h1 style={{margin: 0}}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`
          }}>
          {siteTitle}
        </Link>
      </h1>
      <ul className="languages">
        {languages.map((lng) => (
          <li key={lng}>
            <Link to={originalPath} language={lng}>
              {lng}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
};
```

## Plugin Options

| Option                      | Type     | Description                                                                                                                                                                                                                                                                                  |
| --------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| localeJsonSourceName        | string   | name of JSON translation file nodes that are loaded by `gatsby-source-filesystem` (set by `option.name`). Default is `locale`                                                                                                                                                                |
| localeJsonNodeName          | string   | name of GraphQL node that holds locale data. Default is `locales`                                                                                                                                                                                                                            |
| languages                   | string[] | supported language keys                                                                                                                                                                                                                                                                      |
| defaultLanguage             | string   | default language when visiting `/page` instead of `/es/page`                                                                                                                                                                                                                                 |
| fallbackLanguage            | string   | optionally fallback to a different language than the defaultLanguage                                                                                                                                                                                                                         |
| generateDefaultLanguagePage | boolean  | generate dedicated page for default language. e.g) `/en/page`. It is useful when you need page urls for all languages. For example, server-side [redirect](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createRedirect) using `Accept-Language` header. Default is `false`. |
| redirect                    | boolean  | if the value is `true`, `/` or `/page-2` will be redirected to the user's preferred language router. e.g) `/es` or `/es/page-2`. Otherwise, the pages will render `defaultLangugage` language. Default is `true`                                                                             |
| siteUrl                     | string   | public site url, is used to generate language specific meta tags                                                                                                                                                                                                                             |
| pages                       | array    | an array of [page options](#page-options) used to modify plugin behaviour for specific pages                                                                                                                                                                                                 |
| i18nextOptions              | object   | [i18next configuration options](https://www.i18next.com/overview/configuration-options)                                                                                                                                                                                                      |
| verbose                     | boolean  | Verbose output. Default is true                                                                                                                                                                                                                                                              |

## Page options

| Option              | Type    | Description                                                                                                                                                                                      |
| ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| matchPath           | string  | a path pattern like `/:lang?/blog/:uid`, check [path-to-regexp](https://github.com/pillarjs/path-to-regexp) for more info                                                                        |
| getLanguageFromPath | boolean | if set to `true` the language will be taken from the `:lang` param in the path instead of automatically generating a new page for each language                                                  |
| excludeLanguages    | array   | an array of languages to exclude, if specified the plugin will not automatically generate pages for those languages, this option can be used to replace pages in some languages with custom ones |
| languages           | array   | an array of languages, if specified the plugin will automatically generate pages only for those languages                                                                                        |

## Plugin API

### `Link`

`Link` component is identical to [Gatsby Link component](https://www.gatsbyjs.org/docs/gatsby-link/) except that you can provide additional `language` prop to create a link to a page with different language

```javascript
import {Link} from 'gatsby-plugin-react-i18next';

const SpanishAboutLink = () => (
  <Link to="/about" language="es">
    About page in Spanish
  </Link>
);
```

### `I18nextContext`

Use this react context to access language information about the page

```javascript
const context = React.useContext(I18nextContext);
```

Content of the context object

| Attribute       | Type     | Description                                              |
| --------------- | -------- | -------------------------------------------------------- |
| language        | string   | current language                                         |
| languages       | string[] | supported language keys                                  |
| routed          | boolean  | if `false` it means that the page is in default language |
| defaultLanguage | string   | default language provided in plugin options              |
| originalPath    | string   | page path in default language                            |
| path            | string   | page path                                                |
| siteUrl         | string   | public site url provided in plugin options               |

The same context will be also available in the Gatsby `pageContext.i18n` object

### `useI18next`

This react hook returns `I18nextContext`, object and additional helper functions

| Function       | Description                                                                                                                                                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| navigate       | This is a wrapper around [Gatsby navigate helper function](https://www.gatsbyjs.org/docs/gatsby-link/#how-to-use-the-navigate-helper-function) that will navigate to the page in selected language                                        |
| changeLanguage | A helper function to change language. The first parameter is a language code. Signature: `(language: string, to?: string, options?: NavigateOptions) => Promise<void>`. You can pass additional parameters to navigate to different page. |

`useI18next` also exposes the output of react i18next [`useTranslation`](https://react.i18next.com/latest/usetranslation-hook) so you can use

```javascript
const {t} = useI18next();
```

## How to exclude pages that already have language key in path

For example if you have some other plugin or script that generates your blog posts from headless CRM like [prismic.io](https://prismic.io/) in different languages you would like to exclude those pages, to not generate duplicates for each language key. You can do that by providing `pages` option.

```js
pages: [
  {
    matchPath: '/:lang?/blog/:uid',
    getLanguageFromPath: true,
    excludeLanguages: ['es']
  }
];
```

You have to specify a `:lang` url param, so the plugin knows what part of the path should be treated as language key.
In this example the plugin will automatically generate language pages for all languages except `es`. Assuming that you have `['en', 'es', 'de']` languages the blog post with the path `/blog/hello-world` you will have the following pages generated:

- `/blog/hello-world` - the English version (if you have `en` as a `defaultLanguage`)
- `/es/blog/hello-world` - the Spanish version that should exist before you run the plugin (created manually or at build time with a plugin or api call)
- `/de/blog/hello-world` - the German version that is generated automatically

Omit `excludeLanguages` to get all the languages form the path. Make sure that you have pages for all the languages that you specify in the plugin, otherwise you might have broken links.

You may also need to add a pages config for the 404 page, if it uses the same path pattern as your excluded pages. Note that the order of these rules is important.

```js
pages: [
  {
    matchPath: '/:lang?/404',
    getLanguageFromPath: false
  },
  {
    matchPath: '/:lang?/:uid',
    getLanguageFromPath: true,
    excludeLanguages: ['es']
  }
];
```

## How to exclude a page that should not be translated

You can limit the languages used to generate versions of a specific page, for example to limit `/preview` page to only English version:

```js
pages: [
  {
    matchPath: '/preview',
    languages: ['en']
  }
];
```

## How to fetch translations of specific namespaces only

You can use `ns` and `language` field in gatsby page queries to fetch specific namespaces that are being used in the page. This will be useful when you have several big pages with lots of translations.

```javascript
export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {ns: {in: ["common", "index"]}, language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
```

Note that in this case only files `common.json` and `index.json` will be loaded.
This plugin will automatically add all loaded namespaces as fallback namespaces so if you don't specify a namespace in your translations they will still work.

## How to fetch language specific data

You can use `language` variable in gatsby page queries to fetch additional data for each language. For example if you're using [gatsby-transformer-json](https://www.gatsbyjs.org/packages/gatsby-transformer-json/) your query might look like:

```javascript
export const query = graphql`
  query ($language: String!) {
    dataJson(language: {eq: $language}) {
      ...DataFragment
    }
  }
`;
```

## How to add `sitemap.xml` for all language specific pages

You can use [gatsby-plugin-sitemap](https://www.gatsbyjs.org/packages/gatsby-plugin-sitemap/) to automatically generate a sitemap during build time. You need to customize `query` to fetch only original pages and then `serialize` data to build a sitemap. Here is an example:

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: 'gatsby-plugin-sitemap',
    options: {
      excludes: ['/**/404', '/**/404.html'],
      query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage(filter: {context: {i18n: {routed: {eq: false}}}}) {
              edges {
                node {
                  context {
                    i18n {
                      defaultLanguage
                      languages
                      originalPath
                    }
                  }
                  path
                }
              }
            }
          }
        `,
      serialize: ({site, allSitePage}) => {
        return allSitePage.edges.map((edge) => {
          const {languages, originalPath, defaultLanguage} = edge.node.context.i18n;
          const {siteUrl} = site.siteMetadata;
          const url = siteUrl + originalPath;
          const links = [
            {lang: defaultLanguage, url},
            {lang: 'x-default', url}
          ];
          languages.forEach((lang) => {
            if (lang === defaultLanguage) return;
            links.push({lang, url: `${siteUrl}/${lang}${originalPath}`});
          });
          return {
            url,
            changefreq: 'daily',
            priority: originalPath === '/' ? 1.0 : 0.7,
            links
          };
        });
      }
    }
  }
];
```

## How to use a fallback language with semantic keys (vs. message strings)

By default this plugin is setup to fallback on the entire **message string**, that is used as language key.

In order to use **semantic keys**, so the fallback message string is the default's language value (instead of the key), it is possible to do the following;

In `/gatsby-config.js`, setup the plugin as usual, and add the key `options.i18nextOptions.fallbackLng` (i18next documentation, [configuration options](https://www.i18next.com/overview/configuration-options#languages-namespaces-resources), and [fallback options](https://www.i18next.com/principles/fallback#fallback));

```
{
    resolve: `gatsby-plugin-react-i18next`,
    options: {
        localeJsonSourceName: `locale`,
        languages: [`en`, `de`, `fr`],
        defaultLanguage: `en`,
        siteUrl: `https://example.com/`,
        i18nextOptions: {
            fallbackLng: 'en', // here we provide the fallback language to i18next
            interpolation: {
                escapeValue: false
            },
            keySeparator: false,
            nsSeparator: false
        }
    }
}
```

Then in a page query, we avoid to specify a `$language` variable used as filter, so i18next gets access to the available locales, used as fallback.

```
// /pages/index.js
export const query = graphql`
  query { // no $language variable defined, no filters on allLocale
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
```

## How to extract translations from pages

You can use [babel-plugin-i18next-extract](https://i18next-extract.netlify.app) automatically extract translations inside `t` function and `Trans` component from you pages and save them in JSON.

1. Install

```
yarn add @babel/cli @babel/plugin-transform-typescript babel-plugin-i18next-extract -D
```

2. create `babel-extract.config.js` file (don't name it `babel.config.js`, or it will be used by gatsby)

```javascript
module.exports = {
  presets: ['babel-preset-gatsby'],
  plugins: [
    [
      'i18next-extract',
      {
        keySeparator: null,
        nsSeparator: null,
        keyAsDefaultValue: ['en'],
        useI18nextDefaultValue: ['en'],
        discardOldKeys: true,
        outputPath: 'locales/{{locale}}/{{ns}}.json',
        customTransComponents: [['gatsby-plugin-react-i18next', 'Trans']]
      }
    ]
  ],
  overrides: [
    {
      test: [`**/*.ts`, `**/*.tsx`],
      plugins: [[`@babel/plugin-transform-typescript`, {isTSX: true}]]
    }
  ]
};
```

3. add a script to your `package.json`

```json
{
  "scripts": {
    "extract": "yarn run babel --config-file ./babel-extract.config.js -o tmp/chunk.js 'src/**/*.{js,jsx,ts,tsx}' && rm -rf tmp"
  }
}
```

If you want to extract translations per page, you can add a special comment at the beginning of the page:

```
// i18next-extract-mark-ns-start about-page
```

This will create a file `about-page.json` with all the translations on this page.

To load this file you need to specify a namespace like this:

```javascript
export const query = graphql`
  query ($language: String!) {
    locales: allLocale(
      filter: {ns: {in: ["translation", "about-page"]}, language: {eq: $language}}
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
```

### Automatically translate to different languages

After your messages had been extracted you can use [AWS Translate](https://aws.amazon.com/translate/) to automatically translate messages to different languages.

This functionality is out of the scope of this plugin, but you can get the idea from [this script](/example/translate.js).

## How to fallback to a different language than the defaultLanguage

By default, on first load, this plugin will fallback to the defaultLanguage if the browser's detected language is not included in the array of languages.

If you want to fallback to a different language in the languages array, you can set the `fallbackLanguage` option.

For example, if the default language of your site is Japanese, you only have English as another language, and you want all other browser-detected languages to fallback to English, not Japanese.

```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-react-i18next',
      options: {
        defaultLanguage: 'ja',
        fallbackLanguage: 'en'
      }
    }
  ]
};
```

## Mentions

- [Best internationalization for Gatsby](https://dev.to/adrai/best-internationalization-for-gatsby-mkf) by
  Adriano Raiano

## Credits

This package is based on:

- [gatsby-plugin-intl](https://github.com/wiziple/gatsby-plugin-intl) by Daewoong Moon
- [gatsby-i18n-plugin](https://github.com/ikhudo/gatsby-i18n-plugin) by ikhudo

## License

MIT &copy; [microapps](https://github.com/microapps)
