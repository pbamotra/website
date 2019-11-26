import React, { StatelessComponent } from "react"
import { rhythm } from "../utils/typography"
import Nav from "./nav"
import styled, { css } from "styled-components"
import { ProfileContainer } from "../pages"

const LayoutContainer = styled.div<{ path: string; sidebyside: boolean }>`
  margin-left: auto;
  margin-right: auto;
  max-width: ${rhythm(24)};
  padding: ${rhythm(1.5)} ${rhythm(3 / 4)};
  padding-bottom: 0;

  ${({ sidebyside }) =>
    sidebyside
      ? `
    margin: 0;
    max-width: 100%;

    @media (min-width: 700px) {
      padding-right: 0;
    }

    nav {
      max-width: ${rhythm(18)};
    }
  `
      : ""}

  ${({ path }) =>
    path === "/"
      ? css`
          @media (min-width: 700px) {
            display: flex;
            min-height: 100vh;
            align-items: center;
            justify-content: center;
            footer {
              display: none;
            }

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
        `
      : ""}
`

export const Layout: StatelessComponent<{
  location: any
  sideBySide?: boolean
}> = ({ location, sideBySide, children, ...rest }) => {
  return (
    <LayoutContainer sidebyside={sideBySide} path={location.pathname} {...rest}>
      <Nav path={location.pathname} />
      <main>{children}</main>
    </LayoutContainer>
  )
}

export default Layout
