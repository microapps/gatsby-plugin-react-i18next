// i18next-extract-mark-ns-start index

import React from 'react';
import {Link, Trans, useTranslation} from 'gatsby-plugin-react-i18next';
import {graphql, Link as GatsbyLink} from 'gatsby';
import {StaticImage} from 'gatsby-plugin-image';
import Layout from '../components/layout';
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
        <StaticImage
          src="../images/gatsby-astronaut.png"
          alt="Hi people"
          placeholder="none"
          width={300}
          height={300}
        />
      </div>
      <p>
        <Link to="/page-2/">
          <Trans>Go to page 2</Trans>
        </Link>
      </p>
      <p>
        <GatsbyLink to="/ignored-page">
          <Trans>Go to ignored page</Trans>
        </GatsbyLink>
      </p>
    </Layout>
  );
};

export default IndexPage;

export const query = graphql`
  query($language: String!) {
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
