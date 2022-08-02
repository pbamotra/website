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

const DetailContainer = styled.div({
  fontSize: "0.8rem",
  opacity: 0.8,
  marginTop: "2rem",
  cursor: "pointer",
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
        <Title>Hi, Pankesh here!</Title>
        <div>
          <Subtitle>
            I'm an ML engineer at{" "}
            <a href="https://autodesk.com">Autodesk</a>, where I build 
            assistive automation for <a href="https://help.autodesk.com/view/ACD/2023/ENU/?guid=GUID-64CFD65E-ABD0-49A8-9218-D4E2D22BC070">AutoCAD</a>.
          </Subtitle>
          {/* <p>
             More description can be added here. But, let's hold our horses for now.
          </p> */}
          <p>
            If you'd like to get in contact, you can{" "}
            <a href="mailto:info@pankesh.com">email me</a> or find me on{" "}
            <a href="https://github.com/pbamotra">Github</a> or{" "}
            <a href="https://twitter.com/intent/user?screen_name=_pbamotra_">
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

      <DetailContainer>
        Theme credits: <a href="https://bennetthardwick.com">@bennetthardwick</a>
      </DetailContainer>
    </ContentContainer>
  );
}
