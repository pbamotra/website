import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import "prismjs/themes/prism.css";

import { getMDXComponent } from "mdx-bundler/client";

import { getAllPostSlugs, getPostByPath, getRecentPosts } from "lib/posts";
import { useMemo } from "react";
import styled from "@emotion/styled";

interface PostLink {
  title: string;
  slug: string;
}

interface PostProps {
  slug: string;
  title: string;
  code: string;
  createdAt: number;
  modifiedAt: number;
  tags: string[];
  previous?: PostLink;
  next?: PostLink;
}

const PostTitle = styled.h1({});

const PostContainer = styled.div({
  width: "100%",
  maxWidth: "660px",
  paddingTop: "1rem",
});

const PostContent = styled.div({});

const HomeLink = styled.a({
  borderBottom: "none",
  color: "black",
  cursor: "pointer",
});

export default function Post({ slug, title, code }: PostProps) {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <PostContainer>
      <Link href={"/"}>
        <HomeLink>Home</HomeLink>
      </Link>
      <PostTitle>{title}</PostTitle>
      <PostContent>
        <Component />
      </PostContent>
    </PostContainer>
  );
}

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  if (!Array.isArray(params.slug)) {
    throw new Error("Expected slug to be string!");
  }

  const {
    createdAt,
    code,
    slug,
    title,
    modifiedAt,
    type,
  } = await getPostByPath(params.slug.join("/"));

  const props: PostProps = {
    slug,
    code: await code(),
    createdAt,
    tags: [],
    modifiedAt,
    title,
  };

  if (type === "article") {
    const allArticles = await getRecentPosts();

    const index = allArticles.findIndex((x) => x.slug === slug);

    const previous = allArticles[index - 1];

    if (previous) {
      props.previous = { title: previous.title, slug: previous.slug };
    }

    const next = allArticles[index + 1];

    if (next) {
      props.next = {
        title: next.title,
        slug: next.slug,
      };
    }
  }

  return {
    props,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPostSlugs();
  const paths = posts.map((slug) => ({ params: { slug: slug.split("/") } }));

  return {
    paths,
    fallback: false,
  };
};
