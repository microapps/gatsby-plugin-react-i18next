# gatsby-plugin-react-i18next

Easily translate your Gatsby website into multiple languages.

## Features

- Seamless integration with [react-i18next](https://react.i18next.com/) - a powerful internationalization framework for React
- Automatic redirection based on the user's preferred language in browser provided by [browser-lang](https://github.com/wiziple/browser-lang).
- Support multi-language url routes in a single page component. This means you don't have to create separate pages such as `pages/en/index.js` or `pages/es/index.js`.

## Why?

When you build multilingual sites, Google recommends using different URLs for each language version of a page rather than using cookies or browser settings to adjust the content language on the page. [(read more)](https://support.google.com/webmasters/answer/182192?hl=en&ref_topic=2370587)

## How to use

### Install package

```
yarn add gatsby-plugin-react-i18next
```

or

```
npm install --save gatsby-plugin-react-i18next
```

### Configure the plugin

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-plugin-react-i18next`,
    options: {
      path: `${__dirname}/locales`,
      languages: ['en', 'es', 'de'],
      defaultLanguage: `en`,

      // you can pass any i18next options
      // pass following options to allow message content as a key
      i18nextOptions: {
        interpolation: {
          escapeValue: false // not needed for react as it escapes by default
        },
        keySeparator: false,
        nsSeparator: false
      }
    }
  }
];
```

### You'll also need to add language JSON resources to the project.

For example,

| language resource files                                              | language |
| -------------------------------------------------------------------- | -------- |
| [/locales/en/translation.json](/example/locales/en/translation.json) | English  |
| [/locales/es/translation.json](/example/locales/es/translation.json) | Spanish  |
| [/locales/de/translation.json](/example/locales/de/translation.json) | German   |

You can use different namespaces to organize your translations. Use the following file structure:

```
|-- language
   |-- namespace.json
```

For example:

```
|-- en
    |-- header.json
    |-- footer.json
```

The default namespace is `translation`

### Change your components

Use react i18next [`useTranslation`](https://react.i18next.com/latest/usetranslation-hook) react hook and [`Trans`](https://react.i18next.com/latest/trans-component) component to translate your pages.

`gatsby-plugin-react-i18next` exposes all [`react-i18next`](https://react.i18next.com/) methods and components.

Replace [Gatsby `Link`](https://www.gatsbyjs.org/docs/gatsby-link) component with the `Link` component exported from `gatsby-plugin-react-i18next`

```javascript
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
import './header.css';
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

## Plugin Options

| Option          | Type     | Description                                                                                                                                                                                    |
| --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| path            | string   | path to the folder with JSON translations                                                                                                                                                      |
| languages       | string[] | supported language keys                                                                                                                                                                        |
| defaultLanguage | string   | default language when visiting `/page` instead of `es/page`                                                                                                                                    |
| redirect        | boolean  | if the value is `true`, `/` or `/page-2` will be redirected to the user's preferred language router. e.g) `/es` or `/es/page-2`. Otherwise, the pages will render `defaultLangugage` language. |
| i18nextOptions  | object   | [i18next configuration options](https://www.i18next.com/overview/configuration-options)                                                                                                        |

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

```
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

## How to extract translations from pages

You can use [babel-plugin-i18next-extract](https://i18next-extract.netlify.app) automatically extract translations inside `t` function and `Trans` component from you pages and save them in JSON.

1. Install

```
yarn add @babel/cli babel-plugin-i18next-extract -D
```

2. create `babel.config.js` file

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
  ]
};
```

3. add a script to your `package.json`

```json
{
  "scripts": {
    "extract": "yarn run babel -f babel.config.js -o tmp/chunk.js 'src/**/*.{js,jsx,ts,tsx}' && rm -rf tmp"
  }
}
```

### Automatically translate to different languages

After your messages had been extracted you can use [AWS Translate](https://aws.amazon.com/translate/) to automatically translate messages to different languages.

This functionality is out of the scope of this plugin, but you can get the idea from [this script](/example/translate.js)

## License

MIT &copy; [microapps](https://github.com/microapps)
