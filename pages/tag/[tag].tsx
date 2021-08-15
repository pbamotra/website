import { GetStaticPaths, GetStaticProps } from "next";

import Link from "next/link";
import Head from "next/head";

import { getAllTags, getTag } from "lib/posts";
import HomeLink from "components/HomeLink";
import styled from "@emotion/styled";

interface PostSnapshot {
  slug: string;
  title: string;
}

interface TagPageProps {
  name: string;
  posts: PostSnapshot[];
}

const TagPageContainer = styled.div({
  width: "100%",
  maxWidth: "660px",
});

export default function TagPage({ name, posts }: TagPageProps) {
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
              <Link href={x.slug}>
                <a>{x.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </TagPageContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps<TagPageProps> = async ({
  params,
}) => {

  console.log("Tag static props");
  
  if (!params || typeof params.tag !== "string") {
    throw new Error("Expected tag to be string");
  }

  const tag = await getTag(params.tag);

  if (!tag) {
    throw new Error("Expected tag to be defined");
  }

  return {
    props: {
      name: tag.name,
      posts: tag.posts.map(({ title, slug }) => ({ title, slug })),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {

  console.log("Tag static paths");

  const tags = await getAllTags();
  return {
    paths: tags.map((x) => ({ params: { tag: x.name } })),
    fallback: false,
  };
};
