import React from 'react';
import styled from "@emotion/styled";

const AboutContainer = styled.div({
  textAlign: "center",
  padding: "0 1rem",
});

export default function About() {
  return (
    <AboutContainer>
      Bennett is a Software Engineer working at{" "}
      <a href="https://clipchamp.com">CipherStash</a>. He spends most of his day
      playing with TypeScript and his nights programming in Rust.
      You can follow him on{" "}
      <a href="https://github.com/bennetthardwick">Github</a> or{" "}
      <a href="https://twitter.com/intent/user?screen_name=bennettbackward">
        Twitter
      </a>
      .
    </AboutContainer>
  );
}
