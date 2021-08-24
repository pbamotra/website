import { getTag, getAllTags } from "./posts";

interface PostSnapshot {
  slug: string;
  title: string;
  status: string;
}

export interface TagPageProps {
  name: string;
  posts: PostSnapshot[];
}

export async function getData(name: string): Promise<TagPageProps> {
  const tag = await getTag(name);

  if (!tag) {
    throw new Error("Expected tag to be defined");
  }

  return {
    name: tag.name,
    posts: tag.posts.map(({ title, slug, status }) => ({
      title,
      status,
      slug,
    })),
  };
}

export async function getAllTagNames(): Promise<string[]> {
  return (await getAllTags()).map((x) => x.name);
}
