// i18next-extract-mark-ns-start 404

import {graphql} from 'gatsby';
import React from 'react';
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next';
import Layout from '../components/layout';
import SEO from '../components/seo';

const NotFoundPage = () => {
  const {t} = useTranslation();
  return (
    <Layout>
      <SEO title={t('404: Not found')} />
      <h1>
        <Trans>NOT FOUND</Trans>
      </h1>
      <p>
        <Trans>You just hit a route that doesn&#39;t exist... the sadness.</Trans>
      </p>
    </Layout>
  );
};

export default NotFoundPage;

export const query = graphql`
  query($language: String!) {
    locales: allLocale(filter: {ns: {in: ["common", "404"]}, language: {eq: $language}}) {
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
