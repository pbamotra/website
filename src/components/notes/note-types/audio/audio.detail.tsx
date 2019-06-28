import React, {FunctionComponent} from "react"
import {BaseNote} from "../module"
import styled from "styled-components";
import {AudioPlayer} from '../../../../components/audio/audio';

type Data = {
  link: string;
  title: string;
}

const DetailedTitle = styled.h2`
  margin-top: 0.75rem;
  margin-right: 1rem;
`;

export const AudioNote: FunctionComponent<
  BaseNote<Data> & {modal?: boolean}
> = ({data, modal, title}) => (
  <>
    {modal ? <DetailedTitle>{title}</DetailedTitle> : undefined}
    <AudioPlayer {...data} />
  </>
)
