import React, { StatelessComponent, useEffect, useState } from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"
import styled, { css } from "styled-components"
import { rhythm } from "../utils/typography"
import { Flipper, Flipped } from "react-flip-toolkit"
import { Avatar } from "./avatar"

export const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  * {
    margin: 0px 13px;
  }
`

export const NavContainer = styled.div<{ side: boolean; projectsNav: boolean }>`
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

const ROOT_PATH = `${__PATH_PREFIX__}/`
const BLOG_PATH = `${__PATH_PREFIX__}/blog`
const NOTES_PATH = `${__PATH_PREFIX__}/notes`

const NavLink = styled(Link)`
  font-size: ${rhythm(0.8)};
  display: inline-block;
  width: fit-content;
`

// middle to side =

let previousPath = undefined

export const Nav: StatelessComponent<{ path: string; hideLinks?: boolean }> = ({
  path: currentPath,
  hideLinks,
  children,
  ...rest
}) => {
  const [statePath, setPath] = useState(previousPath || currentPath)

  const path = statePath || currentPath

  useEffect(() => {
    setPath(currentPath)
    previousPath = currentPath
  }, [false])

  const side = path !== ROOT_PATH
  const projectsNav = path.startsWith("/projects/")

  const isAmp = path.endsWith("/amp/")

  return !isAmp ? (
    <nav>
      <Flipper flipKey={previousPath === currentPath}>
        <NavContainer
          {...rest}
          side={side && !projectsNav}
          projectsNav={projectsNav}
        >
          <Flipped translate flipId="home-button">
            <HomeButton to={"/"}>
              <Avatar isAmp={isAmp} />
            </HomeButton>
          </Flipped>
          {!hideLinks && (
            <LinksContainer>
              <Flipped flipId="notes-button">
                <NavLink to={NOTES_PATH}>Notes</NavLink>
              </Flipped>

              <Flipped flipId="blog-button">
                <NavLink to={BLOG_PATH}>Blog</NavLink>
              </Flipped>
            </LinksContainer>
          )}
        </NavContainer>
      </Flipper>
    </nav>
  ) : (
    <nav>
      <NavContainer
        {...rest}
        side={side && !projectsNav}
        projectsNav={projectsNav}
      >
        <HomeButton to={"/"}>
          <Avatar isAmp={isAmp} />
        </HomeButton>
        {!hideLinks && (
          <LinksContainer>
            <NavLink to={NOTES_PATH}>Notes</NavLink>
            <NavLink to={BLOG_PATH}>Blog</NavLink>
          </LinksContainer>
        )}
      </NavContainer>
    </nav>
  )
}

export default Nav
