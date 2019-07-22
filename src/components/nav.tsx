import React, {StatelessComponent} from "react"
import {Link} from "gatsby"
import styled, {css} from "styled-components"
import {Avatar} from "./avatar"
import {Links, LinksContainer, ROOT_PATH} from './links';

export const NavContainer = styled.div<{side: boolean; projectsNav: boolean}>`
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 92px;

  ${props =>
    props.side
      ? css`
          flex-direction: row;
          justify-content: space-between;
        `
      : css`
          flex-direction: column;
          ${LinksContainer} {
            margin-top: 16px;
            flex-direction: column;
          }
        `}

  ${props =>
    props.projectsNav
      ? css`
          ${HomeButton} {
            position: absolute;
            top: 16px;
            left: 16px;

            opacity: 0.22;
            transition: opacity 0.4s;

            :hover {
              opacity: 1;
            }
          }
        `
      : ""}
  
  > * {
    display: flex;
    width: fit-content;
    height: fit-content;
  }
`

export const HomeButton = styled(Link)`
  background-image: none;
`

export const Nav: StatelessComponent<{path: string; hideLinks?: boolean}> = ({
  path: currentPath,
  hideLinks,
  path,
  children,
  ...rest
}) => {
  const side = path !== ROOT_PATH
  const projectsNav = path.startsWith("/projects/")

  const isAmp = path.endsWith("/amp/")

  return (<nav>
    <NavContainer
      {...rest}
      side={side && !projectsNav}
      projectsNav={projectsNav}
    >
      <HomeButton to={"/"}>
        <Avatar isAmp={isAmp} />
      </HomeButton>
      {!hideLinks && (
        <Links />
      )}
    </NavContainer>
  </nav>
  )
}

export default Nav
