import React from "react";
import { Link } from "@reach/router";
import { Head, useRouteData } from "react-static";

import HomeLink from "components/HomeLink";
import styled from "@emotion/styled";

import type { ArchiveProps } from "lib/archive";
import { useShowSeeds } from "lib/seed";

const ArchivePageContainer = styled.div({
  width: "100%",
  maxWidth: "660px",
});

export default function ArchivePage() {
  const { posts } = useRouteData<ArchiveProps>();
  const showSeeds = useShowSeeds();

  return (
    <>
      <Head>
        <title>Archive</title>
      </Head>
      <ArchivePageContainer>
        <HomeLink />
        <h1>Archive</h1>
        <h2>Posts</h2>
        <ul>
          {posts
            .filter((x) => (showSeeds ? true : x.status !== "seed"))
            .map((x) => (
              <li key={x.slug}>
                <Link to={x.slug}>{x.title}</Link>
              </li>
            ))}
        </ul>
      </ArchivePageContainer>
    </>
  );
}
