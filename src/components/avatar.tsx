import { StaticQuery, graphql } from "gatsby"
import React, { FunctionComponent } from "react"
import GatsbyImage from "gatsby-image"
import styled from "styled-components"

const Image = styled(GatsbyImage)`
  img {
    border-radius: 50%;
    margin: 0;
  }
`

export const Avatar: FunctionComponent<{ isAmp: boolean }> = ({ isAmp }) => (
  <StaticQuery
    query={avatarQuery}
    render={data => {
      const image = data.avatar.childImageSharp
      return  !isAmp ? (
        <Image fixed={data.avatar.childImageSharp.fixed} alt={"Bennett Hardwick"} />
      ) : (
        <amp-img
          src={image.fixed.src}
          alt={image.alt}
          layout="responsive"
          width={image.fixed.width}
          height={image.fixed.height}
        />
      )
    }}
  />
);

const avatarQuery = graphql`
  query AvatarQuery {
    avatar: file(absolutePath: { regex: "/profile.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
