import styled from "@emotion/styled";
import Head from "next/head";
import { useRouter } from "next/router";

import "../styles/main.scss";

const Container = styled.div({
  margin: "auto",
  maxWidth: "1100px",
  width: "100%",
  marginBottom: "20vh",
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <Container>
      <Head>
        <title>Bennett's Rust Journal</title>
        <meta property="og:title" content="Bennett's Rust Journal" />
        <meta property="twitter:title" content="Bennett's Rust Journal" />

        <meta property="twitter:creator" content="@bennettbackward" />

        <meta property="twitter:site" content="@bennettbackward" />

        <link
          rel="canonical"
          href={`https://bennetthardwick.com${router.asPath}`}
        />

        <meta
          property="og:url"
          content={`https://bennetthardwick.com${router.asPath}`}
        />

        <meta
          property="og:image"
          content={"https://bennetthardwick.com/profile.jpg"}
        />
        <meta
          property="twitter:image"
          content={"https://bennetthardwick.com/profile.jpg"}
        />
        <meta property="og:image:width" content={"400"} />

        <meta property="og:image:height" content={"400"} />

        <meta property="og:type" content="article" />
      </Head>
      <Component {...pageProps} />
    </Container>
  );
}
