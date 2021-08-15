import styled from "@emotion/styled";
import Head from "next/head";
import { useRouter } from "next/router";
import { AppProps } from "next/app";

import "../styles/main.scss";

const Container = styled.div({
  margin: "auto",
  maxWidth: "1100px",
  width: "100%",
  marginBottom: "20vh",
});

const DESCRIPTION =
  "The blog, exobrain, digital garden, personal musings and thoughts of me, Bennett, a Software Developer making videos at Clipchamp.";

const dataLayer =
  typeof window === "undefined"
    ? []
    : ((window as any).dataLayer = ((window as any).dataLayer as []) ?? []);

function gtag(...args: unknown[]) {
  dataLayer.push(...(args as never[]));
}
gtag("js", new Date());
gtag("config", "UA-153493405-1");

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <Container>
      <Head>
        <title>Bennett's Rust Journal</title>

        <meta name="description" content={DESCRIPTION} />
        <meta name="twitter:description" content={DESCRIPTION} />

        <meta name="og:title" content="Bennett's Rust Journal" />
        <meta name="twitter:title" content="Bennett's Rust Journal" />

        <meta name="twitter:creator" content="@bennettbackward" />

        <meta name="twitter:site" content="@bennettbackward" />

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-153493405-1"
        ></script>

        <link
          rel="canonical"
          href={`https://bennetthardwick.com${router.asPath}`}
        />

        <meta
          name="og:url"
          content={`https://bennetthardwick.com${router.asPath}`}
        />

        <meta
          name="og:image"
          content={"https://bennetthardwick.com/profile.jpg"}
        />
        <meta
          name="twitter:image"
          content={"https://bennetthardwick.com/profile.jpg"}
        />
        <meta name="og:image:width" content={"400"} />

        <meta name="og:image:height" content={"400"} />

        <meta name="og:type" content="article" />
      </Head>
      <Component {...pageProps} />
    </Container>
  );
}
