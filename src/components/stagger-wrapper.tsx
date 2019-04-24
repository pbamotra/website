import styled, { css } from "styled-components"
import { StatelessComponent, useState, useEffect } from "react"
import { Flipped, Flipper } from "react-flip-toolkit"
import React from "react"
import { isMobileBrowser } from "../utils/mobile"

function isSSR() {
  return typeof window === "undefined"
}

const StaggerContainer = styled.div``

export const Stagger = !(isSSR() || isMobileBrowser())
  ? ({ children, id, ...rest }) => (
      <Flipped stagger="default" flipId={id} {...rest}>
        <StaggerContainer>{children}</StaggerContainer>
      </Flipped>
    )
  : ({ children, id, ...rest }) => <div {...rest}>{children}</div>

export const StaggerAnimationContainer = !(isSSR() || isMobileBrowser())
  ? styled.div<{ visible: boolean }>`
      ${props =>
        props.visible
          ? css`
              & {
                ${StaggerContainer} {
                  opacity: 1;
                  transform: translateY(0);
                  position: relative;
                }
              }
            `
          : css`
              & {
                ${StaggerContainer} {
                  opacity: 0;
                  transform: translateY(15px);
                  position: relative;
                }
              }
            `}
    `
  : ({ children, visible, ...rest }) => <div {...rest}>{children}</div>

export const StaggerWrapper: StatelessComponent = ({ children, ...rest }) => {
  const [isVisible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [false])

  return (
    <Flipper
      {...rest}
      flipKey={isVisible}
      staggerConfig={{ default: { speed: 0.2 } }}
    >
      <StaggerAnimationContainer visible={isVisible}>
        {children}
      </StaggerAnimationContainer>
    </Flipper>
  )
}
