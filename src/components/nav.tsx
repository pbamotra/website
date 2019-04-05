import React, { StatelessComponent, useEffect, useState } from "react";
import { graphql, StaticQuery, Link } from "gatsby";
import Image from 'gatsby-image';
import styled, { css } from 'styled-components';
import { rhythm } from "../utils/typography";
import { Flipper, Flipped } from 'react-flip-toolkit';

const NavContainer = styled.div<{ side: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 92px;

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

const BlogLink = styled(Link)`
  font-size: ${rhythm(0.8)};
`

// middle to side = 

let previousPath = undefined;

export const Nav: StatelessComponent<{ path: string }> = ({ path: currentPath }) => {

  const [ statePath, setPath ] = useState(previousPath || currentPath);

  const path = statePath || currentPath;

  useEffect(() => {
    setPath(currentPath);
    previousPath = currentPath;
  }, [false]);

  return (
      <Flipper flipKey={path !== ROOT_PATH}>
      <NavContainer side={path !== ROOT_PATH} >
        <Flipped flipId="home-button">
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
        </Flipped>
        <LinksContainer>
          <Flipped flipId="blog-button">
            <BlogLink to={BLOG_PATH}>
              Blog
            </BlogLink>
          </Flipped>
        </LinksContainer>
      </NavContainer>
      </Flipper>
  )
};

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

