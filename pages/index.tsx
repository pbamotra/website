import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import styled from "@emotion/styled";
import { getAllTags, getRecentGarden, getRecentPosts } from "lib/posts";
import PostPreview from "components/PostPreview";

const HomeContainer = styled.div({
  margin: "auto",
  maxWidth: "1100px",
  width: "100%",
});

const ContentContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gridTemplateRows: "auto",
  height: "200px",
  "@media (max-width: 800px)": {
    gridTemplateColumns: "1fr",
  },
});

const RecentPosts = styled.div({});

const PopularTags = styled.div({});

const PopularContent = styled.div({});

const CategoryTitle = styled.h2({
  margin: "0",
});

interface RecentPost {
  title: string;
  slug: string;
}

interface HomeProps {
  recent: RecentPost[];
  recentGarden: RecentPost[];
  tags: string[];
  popular: unknown[];
}

export default function Home({ recent, tags, recentGarden }: HomeProps) {
  return (
    <>
      <Head>
        <title>Bennett Hardwick</title>
      </Head>
      <HomeContainer>
        <h1>Bennett Hardwick</h1>
        <ContentContainer>
          <RecentPosts>
            <CategoryTitle>Recent Posts</CategoryTitle>
            {recent.map((x) => (
              <PostPreview key={x.slug} post={x} />
            ))}
          </RecentPosts>
          <div>
            <PopularTags>
              <CategoryTitle>Popular Tags</CategoryTitle>
              {tags.map((x) => (
                <Link href={`/tag/${x}`} key={x}>
                  <a>{x}</a>
                </Link>
              ))}
            </PopularTags>
            <PopularContent>
              <CategoryTitle>Posts from the Garden</CategoryTitle>
              {recentGarden.map((x) => (
                <PostPreview key={x.slug} post={x} />
              ))}
            </PopularContent>
          </div>
        </ContentContainer>
      </HomeContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return {
    props: {
      recent: (await getRecentPosts()).slice(0, 10).map(({ title, slug }) => ({
        title,
        slug,
      })),
      recentGarden: (await getRecentGarden())
        .slice(0, 10)
        .map(({ title, slug }) => ({
          title,
          slug,
        })),
      tags: (await getAllTags())
        .filter((x) => x.posts.length > 2)
        .map((x) => x.name),
      popular: [],
    },
  };
};

export const config = { amp: "hybrid" };
