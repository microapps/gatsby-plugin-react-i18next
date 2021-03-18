import React from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import {GatsbyImage} from 'gatsby-plugin-image';

const Image = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: {eq: "gatsby-astronaut.png"}) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 300)
        }
      }
    }
  `);

  return <GatsbyImage image={data.placeholderImage.childImageSharp.gatsbyImageData} />;
};

export default Image;
