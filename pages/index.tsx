import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import styled from "@emotion/styled";
import { getAllTags, getRecentGarden, getRecentPosts } from "lib/posts";
import PostPreview from "components/PostPreview";

const ContentContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gridTemplateRows: "auto",
  gridGap: "4rem",
  "@media (max-width: 800px)": {
    gridTemplateColumns: "1fr",
  },
  marginTop: "8rem",
});

const RecentPosts = styled.div({});

const PopularTags = styled.div({
  marginBottom: "2rem",
});

const PopularContent = styled.div({
  marginBottom: "2rem",
});

const CategoryTitle = styled.h2({
  margin: "0",
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

export default function Home({ recent, tags, recentGarden }: HomeProps) {
  return (
    <>
      <Head>
        <title>Bennett Hardwick</title>
      </Head>
      <IntroContainer>
        <h1>Hi, Bennett here!</h1>
        <div>
          <p>
            I'm a software developer living in Mackay, working on makes movies
            in the browser at <a href="https://clipchamp.com">Clipchamp</a>.
          </p>
          <p>
            When I’m not at work, you’ll find me ricing Archlinux, evangelizing
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

      <ContentContainer>
        <div>
          <RecentPosts>
            <CategoryTitle>Recent Posts</CategoryTitle>
            {recent.map((x) => (
              <PostPreview key={x.slug} post={x} />
            ))}
          </RecentPosts>
        </div>
        <div>
          <PopularContent>
            <CategoryTitle>Posts from the Garden</CategoryTitle>
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
            <CategoryTitle>Tags</CategoryTitle>
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
  return {
    props: {
      recent: (await getRecentPosts())
        .slice(0, 10)
        .map(({ title, slug, description }) => ({
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
