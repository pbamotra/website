import { bundleMDX } from "mdx-bundler";
import path from "path";
import { remarkMdxImages } from "remark-mdx-images";
import remarkFrontmatter from "remark-frontmatter";
import { remarkMdxFrontmatter } from "remark-mdx-frontmatter";
import remarkPrism from "remark-prism";
import remarkFootnotes from "remark-footnotes";
import getConfig from "next/config";

import chokidar from "chokidar";

const md = require("markdown-link-extractor");

import matter from "gray-matter";

import {
  loadBoolean,
  loadDate,
  loadLiteral,
  loadLiteralDefault,
  loadString,
  loadStringArray,
} from "./parse";

import { loadTsFiles, paths, readFile } from "./fs";
import { getFileCreatedDate, getFileModifiedDate } from "./date";
import { DeduplicatedQueue } from "./queue";
import { withoutUndefined } from "./undefined";

const contentDir = path.join(process.cwd(), "content");

const TYPES = ["article", "garden", "generic"] as const;
type PostType = typeof TYPES[number];

const STATUS = ["evergreen", "budding", "seedling", "seed"] as const;
type Status = typeof STATUS[number];

export interface Backlink {
  slug: string;
  title: string;
  description?: string;
  createdAt: number;
  modifiedAt: number;
}

interface BasePost {
  code: () => Promise<string>;
  subtitle?: string;
  description?: string;
  title: string;
  tags: string[];
  slugParts: string[];
  frontmatter: Record<string, unknown>;
  slug: string;
  createdAt: number;
  modifiedAt: number;
  type: PostType;
  status?: Status;
  aliases: string[];
  draft: boolean;
  linksTo: string[];
}

interface Post extends BasePost {
  backlinks: Backlink[];
}

class BacklinkRegistry {
  private state = new Map<string, Map<string, Backlink>>();

  get(page: string): Backlink[] {
    return Array.from(this.state.get(page)?.values() ?? []);
  }

  add(to: string, link: Backlink): void {
    const links = this.state.get(to) ?? new Map<string, Backlink>();
    links.set(link.slug, link);
    this.state.set(to, links);
  }

  remove(to: string, from: string): void {
    this.state.get(to)?.delete(from);
  }
}

type TaskType = "delete" | "add";

class PostCollection {
  static async load(): Promise<PostCollection> {
    const backlinks = new BacklinkRegistry();
    const posts = new Map<string, BasePost>();

    const addPostQueue = new DeduplicatedQueue<TaskType>(async (path, task) => {
      switch (task) {
        case "add": {
          const newPost = await loadPostByName(path);
          const slug = newPost.slug;
          const existing = posts.get(slug);

          if (existing) {
            for (const link of existing.linksTo) {
              backlinks.remove(link, existing.slug);
            }
          }

          for (const link of newPost.linksTo) {
            backlinks.add(
              link,
              withoutUndefined({
                slug: newPost.slug,
                modifiedAt: newPost.modifiedAt,
                createdAt: newPost.createdAt,
                title: newPost.title,
                description: newPost.description,
              })
            );
          }

          posts.set(slug, newPost);
          break;
        }
        case "delete": {
          const { slug } = asSlug(path);
          const existing = posts.get(slug);

          if (existing) {
            for (const link of existing.linksTo) {
              backlinks.remove(link, existing.slug);
            }
          }

          posts.delete(slug);
        }
      }
    });

    await new Promise<void>((resolve) => {
      const watcher = chokidar
        .watch(contentDir, { cwd: contentDir })
        .on("all", (event, path) => {
          if (!hasExtension(path)) {
            return;
          }

          switch (event) {
            case "add":
            case "change":
              addPostQueue.add(path, "add");
              break;
            case "unlink":
              addPostQueue.add(path, "delete");
              break;
          }
        })
        .on("ready", () => {
          if (process.env.NODE_ENV !== "development") {
            console.log("Removing watcher.");
            watcher.close();
          }

          resolve();
        });
    });

    await addPostQueue.waitUntilEmpty();

    return new PostCollection(backlinks, posts);
  }

  private constructor(
    private readonly backlinks: BacklinkRegistry,
    private readonly posts: Map<string, BasePost>
  ) {}

  get(slug: string): Post | undefined {
    const post = this.posts.get(slug);

    if (!post) {
      return undefined;
    }

    const backlinks = this.backlinks.get(slug);

    return {
      ...post,
      backlinks,
    };
  }

  keys(): string[] {
    return Array.from(this.posts.keys());
  }

  all(): Post[] {
    const posts: Post[] = [];

    for (const slug of this.keys()) {
      const post = this.get(slug);

      if (post) {
        posts.push(post);
      }
    }

    return posts;
  }
}

function getPostCollection(): Promise<PostCollection> {
  const x = getConfig();

  if (!x["POST_COLLECTION"]) {
    x["POST_COLLECTION"] = PostCollection.load();
  }

  return x["POST_COLLECTION"];
}

function loadType(type: unknown): PostType {
  return loadLiteralDefault(type, TYPES, "generic");
}

function loadStatus(status: unknown): Status | undefined {
  return loadLiteral(status, STATUS);
}

async function readMdxFile(
  slug: string
): Promise<{ content: string; pathname: string; mdxPath: string }> {
  const paths = [
    slug + ".mdx",
    slug + ".md",
    slug + "/index.mdx",
    slug + "/index.md",
    slug + "/_index.mdx",
    slug + "/_index.md",
  ];

  for (const p of paths) {
    try {
      const mdxPath = path.join(contentDir, p);
      const content = await readFile(mdxPath);

      return { mdxPath, content, pathname: p };
    } catch (e) {}
  }

  throw new Error(`Couldn't find file!`);
}

function asSlug(name: string): { slug: string; parts: string[] } {
  const parts = withoutExtension(name).split("/");

  if (
    parts[parts.length - 1] === "index" ||
    parts[parts.length - 1] === "_index"
  ) {
    parts.pop();
  }

  return { slug: `/${parts.filter((x) => !!x).join("/")}`, parts };
}

async function loadPostByName(name: string): Promise<BasePost> {
  const { slug, parts } = asSlug(name);

  const { content, pathname, mdxPath } = await readMdxFile(slug);

  const code = async () => {
    const { code } = await bundleMDX(content, {
      cwd: path.dirname(mdxPath),
      files: {
        ...(await loadTsFiles("lib")),
        ...(await loadTsFiles("components")),
      },
      xdmOptions: (options) => {
        return {
          ...options,
          remarkPlugins: [
            remarkMdxImages,
            remarkFrontmatter,
            remarkMdxFrontmatter,
            // The types have some trouble here... seems to be fine though
            remarkFootnotes as typeof remarkMdxFrontmatter,
            [
              remarkPrism,
              {
                showSpotlight: true,
                plugins: [
                  "prismjs/plugins/unescaped-markup/prism-unescaped-markup",
                ],
              },
            ],
          ],
        };
      },
      esbuildOptions: (options) => {
        return {
          ...options,
          outdir: path.join(process.cwd(), "public/img"),
          loader: {
            ...options.loader,
            ".png": "file",
            ".jpg": "file",
            ".gif": "file",
          },
          publicPath: "/img/",
          write: true,
        };
      },
    });

    return code;
  };

  const { data: frontmatter } = matter(content);

  const modifiedAt = Number(
    loadDate(frontmatter.modifiedAt, await getFileModifiedDate(mdxPath))
  );

  const createdAt = Number(
    loadDate(frontmatter.createdAt, await getFileCreatedDate(mdxPath))
  );

  const title = frontmatter.title ?? slug;

  const linksTo = (md(content) as string[])
    .filter((x) => x.startsWith(".") || x.startsWith("/"))
    .map(
      (x) => asSlug(x.startsWith(".") ? path.join(pathname, "..", x) : x).slug
    )
    .filter((x) => ["", ".mdx", ".md"].includes(path.extname(x)));

  return withoutUndefined({
    slug,
    modifiedAt,
    createdAt,
    frontmatter,
    code,
    title,
    tags: loadStringArray(frontmatter.tags),
    subtitle: loadString(frontmatter.subtitle),
    description: loadString(frontmatter.description),
    aliases: loadStringArray(frontmatter.aliases),
    type: loadType(frontmatter.type),
    status: loadStatus(frontmatter.status),
    draft: loadBoolean(frontmatter.draft),
    slugParts: parts,
    linksTo,
  });
}

export async function getPostByPath(file: string): Promise<Post> {
  const post = (await getPostCollection()).get(asSlug(file).slug);

  if (!post) {
    throw new Error("Expected post to be defined");
  }

  return withoutUndefined(post);
}

export async function getAllPosts(): Promise<Post[]> {
  return (await getPostCollection())
    .all()
    .filter((x) => (process.env.NODE_ENV === "production" ? !x.draft : true));
}

export async function getRecentPosts(): Promise<Post[]> {
  return (await getAllPosts())
    .filter((x) => x.type === "article")
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getRecentGarden(): Promise<Post[]> {
  return (await getAllPosts())
    .filter((x) => x.type === "garden" && x.status !== "seed")
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getAllPostsSorted(): Promise<Post[]> {
  return (await getAllPosts()).sort((a, b) => b.createdAt - a.createdAt);
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function toRss(posts: Post[]): string {
  const items = posts.map(
    (x) => `<item>
      <guid>https://bennetthardwick.com${x.slug}</guid>
      <title>${escapeHtml(x.title)}</title>
      <link>https://bennetthardwick.com${x.slug}</link>
      <description>${escapeHtml(x.description ?? "")}</description>
      <pubDate>${new Date(x.createdAt).toUTCString()}</pubDate>
    </item>`
  );

  return `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Bennett Hardwick</title>
      <link>https://bennetthardwick.com</link>
      <description>Bennett's Rust Journal</description>
      <language>en</language>
      <lastBuildDate>${new Date(
        posts[0]?.createdAt ?? new Date()
      ).toUTCString()}</lastBuildDate>
      <atom:link href="https://bennetthardwick.com/rss.xml" rel="self" type="application/rss+xml"/>
      ${items.join("\n")}
    </channel>
  </rss>`;
}

interface Tag {
  name: string;
  posts: Post[];
}

export async function getAllTags(): Promise<Tag[]> {
  const tags = new Map<string, Tag>();

  for (const post of await getAllPostsSorted()) {
    for (const tag of post.tags) {
      const t = tags.get(tag) ?? { name: tag, posts: [] };

      t.posts.push(post);

      tags.set(tag, t);
    }
  }

  return Array.from(tags.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getTag(name: string): Promise<Tag | undefined> {
  return (await getAllTags()).find((x) => x.name === name);
}

function withoutExtension(file: string): string {
  if (file.endsWith(".mdx")) {
    return file.slice(0, -".mdx".length);
  }

  if (file.endsWith(".md")) {
    return file.slice(0, -".md".length);
  }

  return file;
}

function hasExtension(file: string): boolean {
  return file.endsWith(".mdx") || file.endsWith(".md");
}

export async function getAllPostSlugs(): Promise<string[]> {
  return (await getPostCollection()).keys().map((x) => {
    // Slugs can't have a slash at the start!
    return x.slice(1);
  });
}

interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
}

export async function getRedirects(): Promise<void> {
  const redirects: Redirect[] = [];

  for (const post of await getAllPosts()) {
    for (const source of post.aliases) {
      redirects.push({
        source: source.endsWith("/") ? source : `${source}/`,
        destination: post.slug,
        permanent: true,
      });

      redirects.push({
        source: source.endsWith("/") ? source.slice(0, -1) : source,
        destination: post.slug,
        permanent: true,
      });
    }
  }

  require("fs").writeFileSync(
    path.join(process.cwd(), "public", "output.js"),
    `module.exports = ${JSON.stringify(redirects)};`
  );
}
