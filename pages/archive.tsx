import { GetStaticPaths, GetStaticProps } from "next";

import Link from "next/link";
import Head from "next/head";

import HomeLink from "components/HomeLink";
import styled from "@emotion/styled";
import { getAllPostsSorted } from "lib/posts";

interface PostSnapshot {
  slug: string;
  title: string;
}

interface ArchiveProps {
  posts: PostSnapshot[];
}

const ArchivePageContainer = styled.div({
  width: "100%",
  maxWidth: "660px",
});

export default function ArchivePage({ posts }: ArchiveProps) {
  return (
    <>
      <Head>
        <title>Archive</title>
      </Head>
      <ArchivePageContainer>
        <HomeLink />
        <h1>Archive</h1>
        <h2>Posts 📚</h2>
        <ul>
          {posts.map((x) => (
            <li key={x.slug}>
              <Link href={x.slug}>
                <a>{x.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </ArchivePageContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps<ArchiveProps> = async () => {
  const posts = await getAllPostsSorted();

  return {
    props: {
      posts: posts.map(({ title, slug }) => ({ title, slug })),
    },
  };
};
