import styled, { css } from 'styled-components';

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