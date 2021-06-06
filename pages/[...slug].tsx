import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { getMDXComponent } from "mdx-bundler/client";

import { getAllPosts, getPostByPath } from "lib/posts";
import { useMemo } from "react";
import styled from "@emotion/styled";

interface PostProps {
  slug: string;
  title: string;
  code: string;
  createdAt: number;
  modifiedAt: number;
  tags: string[];
}

const PostTitle = styled.h1({});

export default function Post({ slug, title, code, createdAt }: PostProps) {
  const router = useRouter();

  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <div>
      craeted: {String(new Date(createdAt))}
      <PostTitle>{title}</PostTitle>
      <Component />
    </div>
  );
}

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  if (!Array.isArray(params.slug)) {
    throw new Error("Expected slug to be string!");
  }

  const { createdAt, code, slug, title, modifiedAt } = await getPostByPath(
    params.slug.join("/")
  );

  return { props: { slug, code, createdAt, tags: [], modifiedAt, title } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getAllPosts()).map((post) => ({
      params: { slug: post.slug.split("/") },
    })),
    fallback: false,
  };
};
