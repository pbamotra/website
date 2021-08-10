import { bundleMDX } from "mdx-bundler";
import path from "path";
import { remarkMdxImages } from "remark-mdx-images";
import remarkFrontmatter from "remark-frontmatter";
import { remarkMdxFrontmatter } from "remark-mdx-frontmatter";
import remarkPrism from "remark-prism";

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

const contentDir = path.join(process.cwd(), "content");

const TYPES = ["article", "garden", "generic"] as const;
type PostType = typeof TYPES[number];

const STATUS = ["evergreen", "budding", "seedling"] as const;
type Status = typeof STATUS[number];

interface Post {
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
}

function loadType(type: unknown): PostType {
  return loadLiteralDefault(type, TYPES, "generic");
}

function loadStatus(status: unknown): Status | undefined {
  return loadLiteral(status, STATUS);
}

async function readMdxFile(
  slug: string
): Promise<{ content: string; mdxPath: string }> {
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

      return { mdxPath, content };
    } catch (e) {}
  }

  throw new Error(`Couldn't find file!`);
}

async function loadPostByName(name: string): Promise<Post> {
  const parts = name.split("/");

  if (
    parts[parts.length - 1] === "index" ||
    parts[parts.length - 1] === "_index"
  ) {
    parts.pop();
  }

  const slug = `/${parts.join("/")}`;

  const { content, mdxPath } = await readMdxFile(slug);

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

  return {
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
  };
}

export async function getPostByPath(file: string): Promise<Post> {
  return await loadPostByName(file);
}

export async function getRecentPosts(): Promise<Post[]> {
  return (await getAllPosts())
    .filter((x) => x.type === "article")
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getRecentGarden(): Promise<Post[]> {
  return (await getAllPosts())
    .filter((x) => x.type === "garden")
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
      <description>${escapeHtml(x.description)}</description>
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
        posts[0].createdAt
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

export async function getAllPostSlugs(): Promise<string[]> {
  const seen = new Set<string>();

  for await (const file of paths("", contentDir)) {
    if (file.endsWith(".mdx")) {
      const parts = file
        .slice(0, -".mdx".length)
        .split("/")
        .filter((x) => !!x);

      if (
        parts[parts.length - 1] === "index" ||
        parts[parts.length - 1] === "_index"
      ) {
        parts.pop();
      }

      const slug = parts.join("/");

      seen.add(slug);
    }
  }

  return Array.from(seen.values());
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

export async function getAllPosts(): Promise<Post[]> {
  return (
    await Promise.all(
      (await getAllPostSlugs()).map(async (slug) => await loadPostByName(slug))
    )
  ).filter((x) => (process.env.NODE_ENV === "production" ? !x.draft : true));
}
