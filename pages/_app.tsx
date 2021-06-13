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

const DESCRIPTION =
  "The blog, exobrain, digital garden, personal musings and thoughts of me, Bennett, a Software Developer making videos at Clipchamp.";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <Container>
      <Head>
        <title>Bennett's Rust Journal</title>

        <meta name="description" content={DESCRIPTION} />
        <meta property="twitter:description" content={DESCRIPTION} />

        <meta property="og:title" content="Bennett's Rust Journal" />
        <meta property="twitter:title" content="Bennett's Rust Journal" />

        <meta property="twitter:creator" content="@bennettbackward" />

        <meta property="twitter:site" content="@bennettbackward" />

        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-153493405-1"></script>

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
