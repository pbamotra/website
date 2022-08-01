import React, { useCallback } from "react";
import { Root, Routes } from "react-static";

// import { Router, useLocation, globalHistory } from "@reach/router";

import { Switch, Route, useLocation, useHistory } from "react-router-dom";

import "./styles/main.scss";

import styled from "@emotion/styled";
import { Head } from "react-static";

const RootContainer = styled.div({
  padding: "2rem",
  width: "100%",
  "@media (max-width: 900px)": {
    padding: "1rem",
  },
});

const Container = styled.div({
  margin: "auto",
  maxWidth: "1100px",
  width: "100%",
  marginBottom: "20vh",
});

const DESCRIPTION =
  "I am a machine learning engineer and I work on image classification, visual search, and object detection";

import { MutableRefObject, useEffect, useRef } from "react";
import { DetailToggle } from "components/DetailToggle";
import { DarkModeToggle } from "components/DarkModeToggle";

export function useScrollBehaviour() {
  const location = useLocation();
  const history = useHistory();
  const historyState: MutableRefObject<{ [key: string]: number }> = useRef({});

  useEffect(() => {
    return history.listen((location, action) => {
      if (action === "PUSH") {
        historyState.current[location.pathname] = 0;
        window.scrollTo(0, 0);
      }

      if (action === "POP") {
        const scroll = historyState.current[location.pathname] ?? 0;
        window.scrollTo(0, scroll);
      }
    });
  }, [history]);

  useEffect(() => {
    function scrollHandler() {
      historyState.current[location.pathname] = window.scrollY;
    }

    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [location.pathname]);
}

function RouteHead() {
  const { pathname } = useLocation();

  useScrollBehaviour();

  return (
    <Head>
      <link rel="canonical" href={`https://pankesh.com${pathname}`} />
      <meta name="og:url" content={`https://pankesh.com${pathname}`} />
    </Head>
  );
}

export default function App() {
  return (
    <Root>
      <RootContainer>
        <Container>
          <Head>
            <title>Pankesh Bamotra</title>

            <meta name="description" content={DESCRIPTION} />
            <meta name="twitter:description" content={DESCRIPTION} />

            <meta name="og:title" content="Pankesh Bamotra" />
            <meta name="twitter:title" content="Pankesh Bamotra" />

            <meta name="twitter:creator" content="@_pbamotra_" />

            <meta name="twitter:site" content="@_pbamotra_" />

            <meta
              name="og:image"
              content={"https://pankesh.com/profile.jpg"}
            />
            <meta
              name="twitter:image"
              content={"https://pankesh.com/profile.jpg"}
            />
            <meta name="og:image:width" content={"400"} />

            <meta name="og:image:height" content={"400"} />

            <meta name="og:type" content="article" />

            <script
              defer
              data-domain="pankesh.com"
              src="https://plausible.io/js/plausible.js"
            ></script>
          </Head>
          <React.Suspense fallback={<em>Loading...</em>}>
            <Switch>
              <Route path="*">
                <Routes
                  path="*"
                  render={useCallback(
                    ({ routePath, getComponentForPath }) => (
                      <>
                        <RouteHead />
                        {getComponentForPath(routePath)}
                      </>
                    ),
                    []
                  )}
                />
              </Route>
            </Switch>
            <DarkModeToggle />
            <DetailToggle />
          </React.Suspense>
        </Container>
      </RootContainer>
    </Root>
  );
}
