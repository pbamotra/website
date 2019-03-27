import React, { StatelessComponent } from "react";
import { graphql, StaticQuery, Link } from "gatsby";
import Image from 'gatsby-image';
import styled, { css } from 'styled-components';
import { rhythm } from "../utils/typography";

const NavContainer = styled.div<{ side: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;

  ${props => props.side ? css`
    flex-direction: row;
    justify-content: space-between;
  ` : css`
    flex-direction: column;
  `}
  
  > * {
    display: block;
    width: fit-content;
    height: fit-content;
  }

`;

const LinksContainer = styled.div`
  display: flex;
`

const HomeButton = styled(Link)`
  background-image: none;
`;

const ROOT_PATH = `${__PATH_PREFIX__}/`
const BLOG_PATH = `${__PATH_PREFIX__}/blog`

const BlogLink = (
  <Link to={BLOG_PATH} style={{ fontSize: rhythm(0.8) }} >
    Blog
  </Link>
);

export const Nav: StatelessComponent<{ path: string }> = ({ path }) => (
  <NavContainer side={path !== ROOT_PATH} >
    <HomeButton to={'/'}>
      <StaticQuery
        query={avatarQuery}
        render={data => (
          <Image
            fixed={data.avatar.childImageSharp.fixed}
            style={{
              minWidth: 50,
              borderRadius: `50%`
            }}
            imgStyle={{
              borderRadius: `50%`
            }} />
        )} />
    </HomeButton>
    <LinksContainer>
      {path !== BLOG_PATH ? BlogLink : undefined}
    </LinksContainer>
  </NavContainer>
);

export default Nav;

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

