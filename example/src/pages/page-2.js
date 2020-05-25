import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import {Link, useTranslation, Trans} from 'gatsby-plugin-react-i18next';

const SecondPage = (props) => {
  const {t} = useTranslation();
  return (
    <Layout>
      <SEO title={t('Page two')} />
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

export default SecondPage;
