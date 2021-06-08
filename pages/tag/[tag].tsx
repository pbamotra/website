import { GetStaticPaths, GetStaticProps } from "next";

import { getAllTags, getTag } from "lib/posts";

interface PostSnapshot {
  slug: string;
  title: string;
}

interface TagPageProps {
  name: string;
  posts: PostSnapshot[];
}

export default function TagPage({ name, posts }: TagPageProps) {
  return <div>Tag page for {name}</div>;
}

export const getStaticProps: GetStaticProps<TagPageProps> = async ({
  params,
}) => {
  if (typeof params.tag !== "string") {
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
  const tags = await getAllTags();
  return {
    paths: tags.map((x) => ({ params: { tag: x.name } })),
    fallback: false,
  };
};
