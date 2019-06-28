import React, {FunctionComponent} from "react"
import {BaseNote} from "../module"
import {PreviewNoteContainer} from "../preview-container";
import {AudioPlayer} from '../../../../components/audio/audio';
import styled from 'styled-components';

type Data = {
  title: string
  link: string
}

const AudioPlayerPreview = styled(AudioPlayer)`
  justify-content: center;
  height: 50px;
`;

export const AudioNotePreview: FunctionComponent<BaseNote<Data>> = ({
  children,
  data: { link, title },
  ...rest
}) => (
    <PreviewNoteContainer {...rest}>
      <h2>{ title }</h2>
      <AudioPlayerPreview link={link} title={''} />
    </PreviewNoteContainer>
  )
