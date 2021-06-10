import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import styled from "@emotion/styled";
import {
  getAllTags,
  getRedirects,
  getRecentGarden,
  getRecentPosts,
  toRss,
} from "lib/posts";
import PostPreview from "components/PostPreview";
import fs from "fs";
import path from "path";

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

const PopularTags = styled.div({
  marginBottom: "2rem",
});

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

interface RecentPost {
  title: string;
  slug: string;
  description: string;
}

interface RecentGarden {
  title: string;
  slug: string;
}

interface HomeProps {
  recent: RecentPost[];
  recentGarden: RecentGarden[];
  tags: string[];
  popular: unknown[];
}

const Tag = styled.a({
  cursor: "pointer",
  border: "none",
  color: "black",
  padding: "4px",
  borderRadius: "4px",
  ":hover": {
    textDecoration: "underline",
  },
});

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

export default function Home({ recent, tags, recentGarden }: HomeProps) {
  return (
    <>
      <IntroContainer>
        <Title>Hi, Bennett here! 👋</Title>
        <div>
          <Subtitle>
            I'm a software developer at{" "}
            <a href="https://clipchamp.com">Clipchamp</a>, where I help people
            make cinematic masterpieces with their browser.
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

      <RecentTitle>Recent Posts 📚</RecentTitle>

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
            <CategoryTitle>The Garden 🌳</CategoryTitle>
            <ul>
              {recentGarden.map((x) => (
                <li key={x.slug}>
                  <Link href={x.slug}>
                    <a>{x.title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </PopularContent>
          <PopularTags>
            <CategoryTitle>Tags 🏷️</CategoryTitle>
            <TagContainer>
              <ul>
                {tags.map((x) => (
                  <li key={x}>
                    <Link href={`/tag/${x}`}>
                      <Tag>{x}</Tag>
                    </Link>
                  </li>
                ))}
              </ul>
            </TagContainer>
          </PopularTags>
        </div>
      </ContentContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const allPosts = await getRecentPosts();

  const rss = toRss(allPosts);

  fs.writeFileSync(path.join(process.cwd(), "public", "rss.xml"), rss);

  // Uncomment to output redirects
  // await getRedirects();

  return {
    props: {
      recent: allPosts.slice(0, 10).map(({ title, slug, description }) => ({
        title,
        description,
        slug,
      })),
      recentGarden: (await getRecentGarden())
        .slice(0, 10)
        .map(({ title, slug }) => ({
          title,
          slug,
        })),
      tags: (await getAllTags())
        .filter((x) => x.posts.length > 1)
        .map((x) => x.name),
      popular: [],
    },
  };
};
