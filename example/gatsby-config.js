const {languages, defaultLanguage} = require('./languages');

module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
    siteUrl: 'https://kind-lichterman-5edcb4.netlify.app'
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png` // This path is relative to the root of the site.
      }
    },
    {
      // including a plugin from outside the plugins folder needs the path to it
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        languages,
        defaultLanguage,
        path: `${__dirname}/locales`,
        siteUrl: 'https://kind-lichterman-5edcb4.netlify.app',
        i18nextOptions: {
          debug: true,
          lowerCaseLng: true,
          saveMissing: false,
          interpolation: {
            escapeValue: false // not needed for react as it escapes by default
          },
          keySeparator: false,
          nsSeparator: false
        },
        pages: [
          {
            matchPath: '/ignored-page',
            languages: ['en']
          }
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        exclude: ['/**/404', '/**/404.html'],
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
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ]
};
