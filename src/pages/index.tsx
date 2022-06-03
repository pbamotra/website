import React from "react";
import type { HomeRouteData } from "lib/home";

import { Link } from "react-router-dom";

import styled from "@emotion/styled";
import PostPreview from "components/PostPreview";
import { useShowSeeds } from "lib/seed";
import { useData } from "lib/useData";

const RecentPosts = styled.div({});

const ContentContainer = styled.div({
  maxWidth: "680px",
});

const Tag = styled(Link)({
  background: "var(--background-tint)",
  borderBottom: "none",

  color: "var(--contrast-text-color)",

  ":visited": {
    color: "var(--contrast-text-color)",
  },

  ":hover": {
    background: "var(--background-tint-hovered)",
  },

  padding: "0.5rem 1rem",
  borderRadius: "4px",
  display: "block",
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

const RecentNotesContainer = styled.ul({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",

  "@media (max-width: 900px)": {
    gridTemplateColumns: "1fr",
  },

  flexWrap: "wrap",
  padding: "0",
  gridGap: "0.5rem",
  "> li": {
    listStyle: "none",
    margin: 0,
  },
});

const RecentNotesLink = styled(Link)({
  background: "var(--background-tint)",
  borderBottom: "none",

  color: "var(--contrast-text-color)",

  ":visited": {
    color: "var(--contrast-text-color)",
  },

  ":hover": {
    background: "var(--background-tint-hovered)",
  },

  padding: "0.5rem 1rem",
  borderRadius: "4px",
  display: "block",
});

const SubtleText = styled.span({
  opacity: 0.5,
});

const NavLink = styled(Link)({
  margin: "1em",
  padding: "0.5rem 2rem",
  borderRadius: "4px",
  borderBottom: "none",
  fontSize: "0.8rem",

  // background: "var(--background-tint)",
});

const Nav = styled.nav({
  margin: "4rem 0",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const TagContainer = styled.ul({
  display: "flex",
  flexWrap: "wrap",
  padding: "0",
  gridGap: "0.5rem",
  "> li": {
    listStyle: "none",
    margin: 0,
  },
});

export default function Home() {
  const { recent, tags, recentGarden } = useData<HomeRouteData>();
  const showSeeds = useShowSeeds();

  return (
    <ContentContainer>
      <div>
        <Title>Hi, Bennett here!</Title>
        <div>
          <Subtitle>
            I'm a software developer at{" "}
            <a href="https://cipherstash.com">CipherStash</a>, where I build a
            searchable encrypted database.
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
      </div>

      <RecentTitle>Recent Notes</RecentTitle>

      <RecentNotesContainer>
        {recentGarden
          .filter((x) => (!showSeeds ? x.status !== "seed" : true))
          .map((x) => (
            <li key={x.slug}>
              <RecentNotesLink to={x.slug}>
                <span>{x.title}</span>
                <br />
                <SubtleText>
                  {new Date(x.createdAt).toLocaleString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </SubtleText>
              </RecentNotesLink>
            </li>
          ))}
      </RecentNotesContainer>

      <RecentTitle>Recent Posts</RecentTitle>

      <RecentPosts>
        {recent.map((x) => (
          <PostPreview key={x.slug} post={x} />
        ))}
      </RecentPosts>

      <RecentTitle>Tags</RecentTitle>

      <TagContainer>
        {tags.map((x) => (
          <li key={x}>
            <Tag to={`/tag/${x}/`}>{x}</Tag>
          </li>
        ))}
      </TagContainer>

      <Nav>
        <NavLink to={`/projects/`}>Projects</NavLink> ·{" "}
        <NavLink to={`/now/`}>Now</NavLink> ·
        <NavLink to={`/archive/`}>Archive</NavLink>
      </Nav>
    </ContentContainer>
  );
}
