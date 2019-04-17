/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql } from "gatsby"
import GatsbyImage from "gatsby-image"
import styled from 'styled-components';
import { rhythm } from "../utils/typography"

const BioContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 82px 0;
  margin-bottom: 48px;
  padding-top: 48px;
  align-items: center;
  text-align: center;
  border-top: solid 1px #e8e8e8;
  position: relative;
`;

const Image = styled(GatsbyImage)`
  img {
    border-radius: 50%;
    margin: 0;
  }
`;

const ImageContainer = styled.div`
  position: absolute;
  top: -35px;
  background: white;
  padding: 8px;
  border-radius: 50%;
  padding-bottom: 0px;
  border: solid 1px #e8e8e8;
  height: fit-content;

  > * {
    display: inline-block;
  }
`;

const AboutSection = styled.p`
  font-size: 0.85rem;
`;

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author } = data.site.siteMetadata
        return (
          <BioContainer>
            <ImageContainer>
              <Image
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
              />
            </ImageContainer>
            <AboutSection>
              <strong>Bennett</strong> is a Software Developer working at{" "}
              <a href="https://clipchamp.com">Clipchamp</a>. He spends most of
              his day playing with React and Gatsby, and editing videos. He's not a fan of social media, but you can
              follow him on{" "}
              <a href="https://github.com/bennetthardwick">Github</a>
            </AboutSection>
          </BioContainer>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

export default Bio
