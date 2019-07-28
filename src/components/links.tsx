import styled from 'styled-components';
import {rhythm} from "../utils/typography"
import React, {FunctionComponent} from 'react';
import {Link} from 'gatsby';

export const ROOT_PATH = `${__PATH_PREFIX__}/`
export const BLOG_PATH = `${__PATH_PREFIX__}/blog`
export const ABOUT_PATH = `${__PATH_PREFIX__}/about`

export const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  * {
    margin: 0px 13px;
  }
`

export const NavLink = styled(Link)`
  font-size: ${rhythm(0.8)};
  display: inline-block;
  width: fit-content;
`


export const Links: FunctionComponent<{}> = props => (<LinksContainer {...props}>
        <NavLink to={ABOUT_PATH}>About</NavLink>
        <NavLink to={BLOG_PATH}>Blog</NavLink>
</LinksContainer>);
