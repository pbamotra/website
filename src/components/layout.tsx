import React, {StatelessComponent} from "react"
import {rhythm} from "../utils/typography"
import Nav from "./nav";
import styled, {css} from 'styled-components';
import {ProfileContainer} from '../pages';

const LayoutContainer = styled.div<{path: string}>`
  margin-left: auto;
  margin-right: auto;
  max-width: ${rhythm(24)};
  padding: ${rhythm(1.5)} ${rhythm(3 / 4)};

  ${({path}) => path === '/' ? css`
    @media (min-width: 600px) {
      display: flex;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
      footer { display: none };

      max-width: 820px;

      main {
        display: flex;
        align-items: center;

        & > ${ProfileContainer} {
          margin-right: 48px;
          flex-shrink: 0;
        }
      }

      nav {
        display: none;
      }
    }
  ` : ''}

`;

export const Layout: StatelessComponent<{location: any}> = ({location, children, ...rest}) => {
  return (<LayoutContainer path={location.pathname} {...rest}>
    <Nav path={location.pathname} />
    <main>{children}</main>
    <footer
      style={{opacity: 0.5, marginTop: rhythm(4), textAlign: "center"}}
    >
      The result of torturous tinkering and misplaced motivation. I'm just
      waiting for things to break.
    </footer>
  </LayoutContainer>)
};

export default Layout
