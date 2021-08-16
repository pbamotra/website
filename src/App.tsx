import React from "react";
import { Root, Routes } from "react-static";
import { Router } from "@reach/router";

import "./styles/main.scss";

import styled from "@emotion/styled";
import { Head } from "react-static";

const Container = styled.div({
  margin: "auto",
  maxWidth: "1100px",
  width: "100%",
  marginBottom: "20vh",
});

const DESCRIPTION =
  "The blog, exobrain, digital garden, personal musings and thoughts of me, Bennett, a Software Developer making videos at Clipchamp.";

const dataLayer: { push: (...args: unknown[]) => void } =
  typeof window === "undefined"
    ? []
    : ((window as any).dataLayer = ((window as any).dataLayer as []) ?? []);

function gtag(...args: unknown[]) {
  dataLayer.push(...(args as never[]));
}
gtag("js", new Date());
gtag("config", "UA-153493405-1");

export default function App(props: any) {
  console.log("Props", props);

  return (
    <Root>
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
            href={`https://bennetthardwick.com${location?.pathname}`}
          />

          <meta
            name="og:url"
            content={`https://bennetthardwick.com${location?.pathname}`}
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
        <React.Suspense fallback={<em>Loading...</em>}>
          <Router>
            <Routes path="*" />
          </Router>
        </React.Suspense>
      </Container>
    </Root>
  );
}
