/**
 * Workaround for missing sitePage.context:
 * Used for generating sitemap with `gatsby-plugin-react-i18next` and `gatsby-plugin-sitemap` plugins
 * https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v3-to-v4/#field-sitepagecontext-is-no-longer-available-in-graphql-queries
 */
exports.createSchemaCustomization = ({actions}) => {
  const {createTypes} = actions;
  createTypes(`
    type SitePage implements Node {
      context: SitePageContext
    }
    type SitePageContext {
      i18n: i18nContext
    }
    type i18nContext {
        language: String,
        languages: [String],
        defaultLanguage: String,
        originalPath: String
        routed: Boolean
    }
  `);
};
