import React, { FunctionComponent } from "react"
import { BaseNote } from "../module"
import { PreviewNoteContainer } from "../preview-container";

type Data = {
  html: string
  preview: string
}

export const TextNotePreview: FunctionComponent<BaseNote<Data>> = ({
  children,
  data,
  ...rest
}) => (
  <PreviewNoteContainer>
    <h2>{ rest.title }</h2>
    <div dangerouslySetInnerHTML={{ __html: data.preview }} {...rest} />
  </PreviewNoteContainer>
)
