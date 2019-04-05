import styled, { css } from 'styled-components';
import { StatelessComponent, useState, useEffect } from 'react';
import { Flipped, Flipper } from 'react-flip-toolkit';
import React from 'react';

export const StaggerAnimationContainer = styled.div<{ visible: boolean }>`
  ${props => props.visible ? css`
    & {
        div, h1, h2, h3, p {
            opacity: 1;
            transform: translateY(0);
            position: relative;
        }
    }
  ` : css`
    & {
        div, h1, h2, h3, p {
            opacity: 0;
            transform: translateY(10px);
            position: relative;
        }
    }
  `}
`

export const Stagger = ({ children, id, ...rest }) => <Stagger id={id} {...rest}>{children}</Stagger>

export const StaggerWrapper: StatelessComponent = ({ children, ...rest }) => {
    const [stateVisible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, [false])

    const isVisible = typeof window === 'undefined' ? true : stateVisible;

    return <Flipper {...rest} flipKey={isVisible} staggerConfig={{ default: { speed: .2 } }}>
        <StaggerAnimationContainer>
            {children}
        </StaggerAnimationContainer>
    </Flipper>
}