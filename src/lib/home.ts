import { getRecentPosts, getRecentGarden, getAllTags } from "./posts";

interface RecentPost {
  title: string;
  slug: string;
  description?: string;
}

interface RecentGarden {
  title: string;
  slug: string;
  status: string;
}

export interface HomeRouteData {
  recent: RecentPost[];
  recentGarden: RecentGarden[];
  tags: string[];
  popular: unknown[];
}

export async function getData(): Promise<HomeRouteData> {
  const allPosts = await getRecentPosts();

  // const rss = toRss(allPosts);

  // fs.writeFileSync(path.join(process.cwd(), "public", "rss.xml"), rss);

  // Uncomment to output redirects
  // await getRedirects();

  return {
    recent: allPosts.slice(0, 10).map(({ title, slug, description }) => ({
      title,
      description,
      slug,
    })),
    recentGarden: (await getRecentGarden())
      .slice(0, 10)
      .map(({ title, status, slug }) => ({
        title,
        status,
        slug,
      })),
    tags: (await getAllTags())
      .filter((x) => x.posts.length > 1)
      .map((x) => x.name),
    popular: [],
  };
}
