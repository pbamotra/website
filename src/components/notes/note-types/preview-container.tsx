import { rhythm } from "../../../utils/typography"
import styled from 'styled-components';

export const PreviewNoteContainer = styled.div`
  h1 {
    margin-top: ${rhythm(0.3)};
    margin-bottom: ${rhythm(0.2)};
    font-size: ${rhythm(0.7)};
  }

  p {
    margin-bottom: ${rhythm(0.3)};
    font-size: ${rhythm(0.55)};
  }

  h2,
  h3,
  h4 {
    margin-top: ${rhythm(0.3)};
    margin-bottom: ${rhythm(0.2)};
    font-size: ${rhythm(0.6)};
  }

  code {
    display: none;
  }
`