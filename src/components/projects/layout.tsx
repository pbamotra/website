import React, { StatelessComponent } from "react"
import { rhythm } from "../../utils/typography"
import Nav, { NavContainer, LinksContainer, HomeButton } from "../nav"
import styled from "styled-components"

const LayoutContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  padding: ${rhythm(1.5)} ${rhythm(3 / 4)};

  nav {
    height: 0px;
  }

  ${NavContainer} {
    margin-left: auto;
    margin-right: auto;
    max-width: calc(${rhythm(24)} - ${rhythm((3 / 4) * 2)});
  }
`

export const Layout: StatelessComponent<{ location: any }> = ({
  location,
  children,
  ...rest
}) => (
  <LayoutContainer {...rest}>
    <Nav hideLinks={true} path={location.pathname} />
    <main>{children}</main>
  </LayoutContainer>
)

export default Layout
