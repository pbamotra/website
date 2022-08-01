import React from 'react';
import styled from "@emotion/styled";

const AboutContainer = styled.div({
  textAlign: "center",
  padding: "0 1rem",
});

export default function About() {
  return (
    <AboutContainer>
      You can follow me on{" "}
      <a href="https://github.com/pbamotra">Github</a> or{" "}
      <a href="https://twitter.com/intent/user?screen_name=_pbamotra_">
        Twitter
      </a>
      .
    </AboutContainer>
  );
}
