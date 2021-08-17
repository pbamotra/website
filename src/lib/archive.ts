import { getAllPostsSorted } from "./posts";

interface PostSnapshot {
  slug: string;
  title: string;
}

export interface ArchiveProps {
  posts: PostSnapshot[];
}

export async function getData(): Promise<ArchiveProps> {
  const posts = await getAllPostsSorted();

  return {
    posts: posts.map(({ title, slug }) => ({ title, slug })),
  };
}
