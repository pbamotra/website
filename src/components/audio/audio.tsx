import React, {StatelessComponent, useRef, useState, useEffect} from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay, faPause} from '@fortawesome/free-solid-svg-icons';

const AudioContainer = styled.div`
  position: relative;
  background: #F2F2F2;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  padding: 10px 10px 10px 25px;
  overflow: hidden;
  text-overflow: ellipse;
`;

const Playbar = styled.div`
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  background: #C2C2C2;
`;

const AudioButton = styled.button`
  background: none;
  border: none;
  outline: none;
  justify-self: flex-start;
  display: flex;
  font-size: 1.2rem;
  z-index: 2;
  cursor: pointer;
  opacity: 0.7;
`;

const Title = styled.h4`
  margin: 0;
  margin-left: 20px;
  opacity: 0.8;
  z-index: 2;
  text-overflow: ellipse;
  flex-shrink: 0;
`;

export const AudioPlayer: StatelessComponent<{link: string, title: string}> = ({link, title, ...rest}) => {

  const audio = useRef<HTMLAudioElement>(null)
  const player = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const play = () => {
    setPlaying(true);
  };

  const pause = () => {
    setPlaying(false);
  };

  useEffect(() => {
    audio.current!.addEventListener('play', play);
    audio.current!.addEventListener('pause', pause);

    return () => {
      audio.current!.removeEventListener('play', play);
      audio.current!.removeEventListener('pause', pause);
    };
  }, []);

  useEffect(() => {
    if (playing) {
      const update = () => {
        setProgress(audio.current!.currentTime / audio.current!.duration * 100);
      };

      const interval = setInterval(update, 30);
      return () => clearInterval(interval);
    } else {
      return () => {};
    }
  }, [playing]);

  const getPercentageFromPosition = (
    x: number,
    leftOffset: number,
    width: number
  ): number => ((x - leftOffset) / width) * 100;

  const goToPosition = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const bounds = player.current!.getBoundingClientRect();
    const percentage = getPercentageFromPosition(e.clientX, bounds.left, bounds.width);

    const normalizedPercentage = Math.max(0, Math.min(100, percentage));

    if (progress === normalizedPercentage) {
      return;
    }

    const duration = audio.current!.duration;

    if (isNaN(duration)) {
      return;
    }

    const newCurrentTime = Math.min(
      Math.max(0, (normalizedPercentage / 100) * duration),
      duration
    );

    console.log(newCurrentTime);

    audio.current!.currentTime = newCurrentTime;

  };

  const mouseDown = (e: React.MouseEvent) => {
    if (!playing) {
      togglePlay();
    }

    goToPosition(e);
  }

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (audio.current) {
      if (audio.current.paused) {
        audio.current.play().catch(() => {});
      } else {
        audio.current.pause();
      }
    }
  };

  return (<AudioContainer onClick={mouseDown} ref={player} {...rest} >
    <AudioButton onClick={togglePlay}>
      {playing ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
    </AudioButton>
    <Title>
      {title}
    </Title>
    <Playbar style={{width: progress + '%'}} />
    <audio ref={audio} preload={'none'}>
      <source src={link} />
    </audio>
  </AudioContainer >)
};
