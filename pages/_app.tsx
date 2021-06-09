import { Global } from "@emotion/react";
import styled from "@emotion/styled";

import "../styles/main.scss";

const Container = styled.div({
  margin: "auto",
  maxWidth: "1100px",
  width: "100%",
  marginBottom: "20vh",
});

export default function App({ Component, pageProps }) {
  return (
    <Container>
      <Component {...pageProps} />
    </Container>
  );
}
