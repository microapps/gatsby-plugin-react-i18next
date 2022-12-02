// i18next-extract-mark-ns-start page-2

import {graphql} from 'gatsby';
import React from 'react';
import Layout from '../components/layout';
import Seo from '../components/seo';
import {Link, useTranslation, Trans} from 'gatsby-plugin-react-i18next';

const SecondPage = (props) => {
  return (
    <Layout>
      <h1>
        <Trans>Page two</Trans>
      </h1>
      <p>
        <Trans>Welcome to page 2</Trans> ({props.path})
      </p>
      <Link to="/">
        <Trans>Go back to the homepage</Trans>
      </Link>
    </Layout>
  );
};

export const Head = () => {
  const {t} = useTranslation();
  return <Seo title={t('Page two')} />;
};

export default SecondPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {ns: {in: ["common", "page-2"]}, language: {eq: $language}}) {
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
