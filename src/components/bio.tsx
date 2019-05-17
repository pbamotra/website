/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React, { FunctionComponent } from "react"
import styled from "styled-components"
import { Avatar } from "./avatar"

const BioContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 82px 0;
  margin-bottom: 48px;
  padding-top: 48px;
  align-items: center;
  text-align: center;
  border-top: solid 1px #e8e8e8;
  position: relative;
`

const ImageContainer = styled.div`
  position: absolute;
  top: -35px;
  background: white;
  padding: 8px;
  border-radius: 50%;
  padding-bottom: 0px;
  border: solid 1px #e8e8e8;
  height: fit-content;

  > * {
    display: inline-block;
  }
`

const AboutSection = styled.p`
  font-size: 0.85rem;
`

const Bio: FunctionComponent<{ isAmp: boolean }> = ({ isAmp }) => {
  return (
    <BioContainer>
      <ImageContainer>
        <Avatar isAmp={isAmp} />
      </ImageContainer>
      <AboutSection>
        <strong>Bennett</strong> is a Software Developer working at{" "}
        <a href="https://clipchamp.com">Clipchamp</a>. He spends most of his day
        playing with React and Gatsby, and editing videos. He's not a fan of
        social media, but you can follow him on{" "}
        <a href="https://github.com/bennetthardwick">Github</a>
      </AboutSection>
    </BioContainer>
  )
};

export default Bio
