import React, { FunctionComponent } from "react"
import { BaseNote } from "../module"
import styled from "styled-components";

type Data = {
  html: string
}

const DetailedTitle = styled.h2`
  margin-top: 0.75rem;
  margin-right: 1rem;
`;

export const TextNote: FunctionComponent<
  BaseNote<Data> & { modal?: boolean }
> = ({ children, data, modal, title, name, type, ...rest }) => (
  <>
    {modal ? <DetailedTitle>{title}</DetailedTitle> : undefined}
    <div dangerouslySetInnerHTML={{ __html: data.html }} {...rest} />
  </>
)
