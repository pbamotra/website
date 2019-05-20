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

const ImageContainer = styled.span`
  > * {
    border-radius: 50%;
    margin: 0;
    overflow: hidden;
    display: flex;
  }
`

export const Avatar: FunctionComponent<{ isAmp: boolean }> = ({ isAmp }) => (
  <StaticQuery
    query={avatarQuery}
    render={data => {
      const image = data.avatar.childImageSharp
      return !isAmp ? (
        <Image
          fixed={data.avatar.childImageSharp.fixed}
          alt={"Bennett Hardwick"}
        />
      ) : (
        <ImageContainer>
          <amp-img
            src-set={image.fixed.srcSet}
            src={image.fixed.src}
            alt={"Bennett Hardwick"}
            width={image.fixed.width}
            height={image.fixed.height}
          />
        </ImageContainer>
      )
    }}
  />
)

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
