import React, { useState, useEffect, useRef } from "react"
import Layout from "../../components/projects/layout"
import SEO from "../../components/seo"
import { rhythm } from "../../utils/typography"
import styled, { css } from "styled-components"
import YoutubePlayer from "youtube-player"

const Title = styled.h1`
  font-size: ${rhythm(3)};
  text-align: center;
  line-height: 0.9;
`

const SubTitle = styled.h3`
  text-align: center;
`

const Container = styled.div`
  position: relative;
  max-width: ${rhythm(30)};
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`

const TitleContainer = styled.div<{ hideContainer: boolean }>`
  position: relative;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in;
  opacity: 1;
  transform: translate(0px);

  ${props =>
    props.hideContainer
      ? css`
          opacity: 0;
          transform: translateY(-35px);
        `
      : ""}
`

const TwoSet = styled.div``
const Normal = styled.div``

const InvisibleCover = styled.div``;
const VideoContainer = styled.div<{
  hideTwoSet: boolean
}>`
  position: relative;
  width: fit-content;
  margin: auto;

  ${InvisibleCover} {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      position: absolute;
      z-index: 12;
  }

  ${TwoSet} {
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    opacity: ${props => (props.hideTwoSet ? "0" : "1")};
  }
`


const CTA = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: auto;
  opacity: 0.1;
  transition: opacity 0.3s;
  padding: 0 70px;
  box-sizing: content-box;


  :hover {
      opacity: 1;
  }
`

interface Payload {
  videoId: string
  startTime: number
  endTime: number
}

function parsePayload(): Payload | undefined {
  if (typeof window === "undefined") {
    return
  }

  const params = new URLSearchParams(window.location.search)

  const startTime = Number(params.get("startTime"))
  const endTime = Number(params.get("endTime"))
  const videoId = params.get("videoId")

  if (isNaN(startTime) || isNaN(endTime) || !videoId) {
    return undefined
  }

  return {
    startTime,
    endTime,
    videoId,
  }
}

export const Template = props => {
  const [hidden, setHidden] = useState(false)
  const [playerShowing, setShowPlayer] = useState(false)
  const [payload, setPayload] = useState(parsePayload())

  const [hideTwoSet, setHideTwoSet] = useState(true)

  const twoSet = useRef<HTMLDivElement>()
  const normal = useRef<HTMLDivElement>()

  useEffect(() => {
    if (!payload) {
      return
    }

    let timeouts
    let startInterval

    const twoSetStart = 507

    const twoSetPlayer = YoutubePlayer(twoSet.current!, {
      videoId: "BvsvaCU6i1M",
      playerVars: { autoplay: 0, controls: 0, start: twoSetStart },
    })

    const normalPlayer = YoutubePlayer(normal.current!, {
      videoId: payload.videoId,
      playerVars: { autoplay: 0, controls: 0, start: payload.startTime },
    })

    twoSetPlayer.mute()
    normalPlayer.mute()
    twoSetPlayer.pauseVideo()
    normalPlayer.pauseVideo()

    let destroyed = false

    Promise.resolve().then(async () => {
      const twoSetDuration = 4100
      const twoSetMute = 300
      const totalDuration = (payload.endTime - payload.startTime) * 1000

      function promiseTimeout(time) {
        return new Promise(resolve => {
          setTimeout(resolve, time)
        })
      }

      let firstTime = true

      async function playVideoOnce() {
        await Promise.all([
          normalPlayer.unMute(),
          normalPlayer.seekTo(payload.startTime, true),
        ])

        await normalPlayer.playVideo()

        console.log("first time")

        twoSetPlayer.seekTo(twoSetStart, true)
        twoSetPlayer.pauseVideo()

        await promiseTimeout(totalDuration - twoSetDuration)

        await twoSetPlayer.playVideo()
        await promiseTimeout(600)

        setHideTwoSet(false)

        await promiseTimeout(twoSetDuration - 600 - twoSetMute)

        await normalPlayer.mute()

        await promiseTimeout(twoSetMute)

        await normalPlayer.unMute()

        firstTime = false

        setHideTwoSet(true)
      }

      while (!destroyed) {
        await playVideoOnce()
      }
    })

    return () => {
      destroyed = true
      twoSetPlayer.destroy()
      normalPlayer.destroy()
    }
  }, [payload])

  return (
    <Layout {...props}>
      <SEO
        title={"Brett and Eddy React to Videos"}
        keywords={["TwoSet Violin", "Brett Yang", "Eddy Chen", "YouTube"]}
      />
      <Container>
        <TitleContainer hideContainer={hidden}>
          <Title>Brett and Eddy React</Title>
          <SubTitle>TwoSet Violin react to a bunch of videos.</SubTitle>
        </TitleContainer>
        <VideoContainer hideTwoSet={hideTwoSet}>
          <InvisibleCover />
          <TwoSet ref={twoSet} />
          <Normal ref={normal} />
        </VideoContainer>
      </Container>
        <CTA action={location.pathname}>
        <br />
        <br />
        <h2>Create Your Own!</h2>
          Youtube Video ID: <input name="videoId" />
          &nbsp; Start (s): <input name="startTime" />
          &nbsp; End (s): <input name="endTime" />
          &nbsp;
          <button type="submit">CREATE!</button>
        </CTA>
    </Layout>
  )
}

export default Template
