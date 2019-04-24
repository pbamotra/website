import React, { FunctionComponent } from "react"
import { BaseNote } from "../module"
import styled from "styled-components"
import { rhythm } from "../../../../utils/typography"
import { PreviewNoteContainer } from "../preview-container"

type Data = {
  title: string
  category: string
  cardCount: number
}

const FlashcardsContainer = styled(PreviewNoteContainer)`
  text-align: center;
  display: flex;
  flex-direction: column;

  h2 {
    font-size: ${rhythm(0.7)};
  }
`

const TypeContainer = styled.div`
  padding: 5px;

  strong {
    color: #1ca086;
  }
`

const Title = styled.h2`
  margin-top: ${rhythm(0.3)};
  margin-bottom: ${rhythm(0.2)};
  font-size: ${rhythm(0.6)};
`

export const FlashcardsNotePreview: FunctionComponent<
  BaseNote<Data> & { modal?: boolean }
> = ({ children, data, modal, title, ...rest }) => (
  <FlashcardsContainer {...rest}>
    <Title>{title}</Title>
    <TypeContainer>
      <strong>{data.cardCount}</strong>&nbsp;flashcards in category&nbsp;
      <strong>{data.category}</strong>
    </TypeContainer>
  </FlashcardsContainer>
)
