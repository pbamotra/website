import { Get, GetStaticProps } from "next";
import Head from "next/head";
import styled from "@emotion/styled";
import { getRecentPosts } from "lib/posts";

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
}

interface HomeProps {
  recent: RecentPost[];
  tags: unknown[];
  popular: unknown[];
}

export default function Home({ recent }: HomeProps) {
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
              <span key={x.title}>{x.title}</span>
            ))}
          </RecentPosts>
          <div>
            <PopularTags>
              <CategoryTitle>Popular Tags</CategoryTitle>
            </PopularTags>
            <PopularContent>
              <CategoryTitle>Popular Posts</CategoryTitle>
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
      recent: (await getRecentPosts()).map(({ title }) => ({ title })),
      tags: [],
      popular: [],
    },
  };
};
