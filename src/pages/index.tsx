import React from "react";
import { useRouteData } from "react-static";
import type { HomeRouteData } from "lib/home";

import { Link } from "@reach/router";

import styled from "@emotion/styled";
import PostPreview from "components/PostPreview";
import { useShowSeeds } from "lib/seed";

const ContentContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gridTemplateRows: "auto",
  gridGap: "4rem",
  "@media (max-width: 800px)": {
    gridTemplateColumns: "1fr",
  },
});

const RecentPosts = styled.div({});

const PopularContent = styled.div({
  marginBottom: "2rem",
});

const CategoryTitle = styled.h3({
  margin: "0",
  fontSize: "1.4rem",
});

const IntroContainer = styled.div({
  maxWidth: "680px",
});

const Tag = styled(Link)({});

const TagContainer = styled.div({
  display: "flex",
  flexWrap: "wrap",
});

const Title = styled.h1({
  fontSize: "3rem",
});

const Subtitle = styled.p({
  fontSize: "1.4rem",
  marginRight: "4rem",
});

const RecentTitle = styled.h2({
  fontSize: "2rem",
  marginTop: "4rem",
});

export default function Home() {
  const { recent, tags, recentGarden } = useRouteData<HomeRouteData>();
  const showSeeds = useShowSeeds();

  return (
    <>
      <IntroContainer>
        <Title>Hi, Bennett here!</Title>
        <div>
          <Subtitle>
            I'm a software developer at{" "}
            <a href="https://cipherstash.com">CipherStash</a>, where I build a searchable encrypted database.
          </Subtitle>
          <p>
            When I’m not at work, you’ll find me ricing Arch Linux, evangelizing
            Vim and spending hours and hours fighting the borrow-checker in
            Rust.
          </p>
          <p>
            If you'd like to get in contact, you can{" "}
            <a href="mailto:me@bennetthardwick.com">email me</a> or find me on{" "}
            <a href="https://github.com/bennetthardwick">Github</a> or{" "}
            <a href="https://twitter.com/intent/user?screen_name=bennettbackward">
              Twitter
            </a>
            .
          </p>
        </div>
      </IntroContainer>

      <RecentTitle>Recent Posts</RecentTitle>

      <ContentContainer>
        <div>
          <RecentPosts>
            {recent.map((x) => (
              <PostPreview key={x.slug} post={x} />
            ))}
          </RecentPosts>
        </div>
        <div>
          <PopularContent>
            <CategoryTitle>The Garden</CategoryTitle>
            <ul>
              {recentGarden
                .filter((x) => (!showSeeds ? x.status !== "seed" : true))
                .map((x) => (
                  <li key={x.slug}>
                    <Link to={x.slug}>{x.title}</Link>
                  </li>
                ))}
            </ul>
          </PopularContent>
          <PopularContent>
            <CategoryTitle>Tags</CategoryTitle>
            <TagContainer>
              <ul>
                {tags.map((x) => (
                  <li key={x}>
                    <Tag to={`/tag/${x}/`}>{x}</Tag>
                  </li>
                ))}
              </ul>
            </TagContainer>
          </PopularContent>
          <PopularContent>
            <CategoryTitle>Links</CategoryTitle>
            <ul>
              <li>
                <Link to={`/projects/`}>Projects</Link>
              </li>
              <li>
                <Link to={`/now/`}>Now</Link>
              </li>
              <li>
                <Link to={`/archive/`}>Archive</Link>
              </li>
            </ul>
          </PopularContent>
        </div>
      </ContentContainer>
    </>
  );
}
