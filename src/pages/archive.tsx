import React, { useMemo } from "react";
import { Link } from "@reach/router";
import { Head } from "react-static";

import HomeLink from "components/HomeLink";
import styled from "@emotion/styled";

import type { ArchiveProps } from "lib/archive";
import { useShowSeeds } from "lib/seed";
import { useData } from "lib/useData";

const ArchivePageContainer = styled.div({
  width: "100%",
  maxWidth: "660px",
});

export default function ArchivePage() {
  const { posts } = useData<ArchiveProps>();
  const showSeeds = useShowSeeds();

  const modifiedPosts = useMemo(() => {
    const map = new Map<number, ArchiveProps["posts"]>();

    for (const post of posts) {
      const key = new Date(post.createdAt).getFullYear();
      const x = map.get(key) ?? [];
      x.push(post);
      map.set(key, x);
    }

    return Array.from(map.entries()).sort(([a], [b]) => b - a);
  }, [posts]);

  return (
    <>
      <Head>
        <title>Archive</title>
      </Head>
      <ArchivePageContainer>
        <HomeLink />
        <h1>Archive</h1>
        <h2>Posts</h2>
        {modifiedPosts.map(([year, p]) => (
          <div key={String(year)}>
            <h3>{year}</h3>
            <ul>
              {p
                .filter((x) => (showSeeds ? true : x.status !== "seed"))
                .map((x) => (
                  <li key={x.slug}>
                    <Link to={x.slug}>{x.title}</Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </ArchivePageContainer>
    </>
  );
}
