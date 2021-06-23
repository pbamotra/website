import { GetStaticPaths, GetStaticProps } from "next";

import "prismjs/themes/prism.css";

import { getAllPostSlugs, getPostByPath, getRecentPosts } from "lib/posts";

import PostPage, { PostPageProps } from "components/PostPage";

export default function Post(props: PostPageProps) {
  return <PostPage {...props} />;
}

export const getStaticProps: GetStaticProps<PostPageProps> = async ({
  params,
}) => {
  if (!Array.isArray(params.slug)) {
    throw new Error("Expected slug to be string!");
  }

  const {
    createdAt,
    code,
    slug,
    title,
    modifiedAt,
    description,
    type,
    tags,
    status,
  } = await getPostByPath(params.slug.join("/"));

  const props: PostPageProps = {
    slug,
    code: await code(),
    createdAt,
    modifiedAt,
    tags,
    title,
    type,
    description,
  };

  if (status) {
    props.status = status;
  }

  if (type === "article") {
    const allArticles = await getRecentPosts();

    const index = allArticles.findIndex((x) => x.slug === slug);

    const previous = allArticles[index + 1];

    if (previous) {
      props.previous = { title: previous.title, slug: previous.slug };
    }

    const next = allArticles[index - 1];

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
