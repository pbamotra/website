import { getAllPostsSorted } from "./posts";

interface PostSnapshot {
  slug: string;
  title: string;
  status: string;
}

export interface ArchiveProps {
  posts: PostSnapshot[];
}

export async function getData(): Promise<ArchiveProps> {
  const posts = await getAllPostsSorted();

  return {
    posts: posts.map(({ title, status, slug }) => ({ title, status, slug })),
  };
}
