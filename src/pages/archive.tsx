import React from "react";
import { Link } from "@reach/router";
import { Head, useRouteData } from "react-static";

import HomeLink from "components/HomeLink";
import styled from "@emotion/styled";

import type { ArchiveProps } from "lib/archive";

const ArchivePageContainer = styled.div({
  width: "100%",
  maxWidth: "660px",
});

export default function ArchivePage() {
  const { posts } = useRouteData<ArchiveProps>();

  return (
    <>
      <Head>
        <title>Archive</title>
      </Head>
      <ArchivePageContainer>
        <HomeLink />
        <h1>Archive</h1>
        <h2>Posts 📚</h2>
        <ul>
          {posts.map((x) => (
            <li key={x.slug}>
              <Link to={x.slug}>{x.title}</Link>
            </li>
          ))}
        </ul>
      </ArchivePageContainer>
    </>
  );
}
