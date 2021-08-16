import React from "react";
import { Link } from "@reach/router";
import { Head, useRouteData } from "react-static";

import type { TagPageProps } from "lib/tags";
import HomeLink from "components/HomeLink";
import styled from "@emotion/styled";

const TagPageContainer = styled.div({
  width: "100%",
  maxWidth: "660px",
});

export default function TagPage() {
  const { name, posts } = useRouteData<TagPageProps>();

  return (
    <>
      <Head>
        <title>Everything tagged "{name}" 🏷️</title>
      </Head>
      <TagPageContainer>
        <HomeLink />
        <h1>Everything tagged "{name}" 🏷️</h1>
        <h2>Posts 📚</h2>
        <ul>
          {posts.map((x) => (
            <li key={x.slug}>
              <Link to={x.slug}>{x.title}</Link>
            </li>
          ))}
        </ul>
      </TagPageContainer>
    </>
  );
}
