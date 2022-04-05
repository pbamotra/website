import React from "react";
import { Link } from "@reach/router";
import { Head } from "react-static";

import type { TagPageProps } from "lib/tags";
import HomeLink from "components/HomeLink";
import styled from "@emotion/styled";
import { useShowSeeds } from "lib/seed";
import { useData } from "lib/useData";

const TagPageContainer = styled.div({
  width: "100%",
  maxWidth: "660px",
});

export default function TagPage() {
  const { name, posts } = useData<TagPageProps>();
  const showSeeds = useShowSeeds();

  const filtered = posts
    .filter((x) => (!showSeeds ? x.status !== "seed" : true))
    .map((x) => (
      <li key={x.slug}>
        <Link to={x.slug}>{x.title}</Link>
      </li>
    ));

  return (
    <>
      <Head>
        <title>Everything tagged "{name}"</title>
      </Head>
      <TagPageContainer>
        <HomeLink />
        <h1>Everything tagged "{name}"</h1>
        <h2>Posts</h2>
        {filtered.length === 0 && (
          <div>No posts for this tag. Check back again later.</div>
        )}
        {filtered.length > 0 && <ul>{filtered}</ul>}
      </TagPageContainer>
    </>
  );
}
