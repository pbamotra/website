import fs from "fs";
import { bundleMDX } from "mdx-bundler";
import path from "path";
import { remarkMdxImages } from "remark-mdx-images";
import remarkFrontmatter from "remark-frontmatter";
import { remarkMdxFrontmatter } from "remark-mdx-frontmatter";
import remarkPrism from "remark-prism";
import matter from "gray-matter";

import { exec } from "child_process";

import { performance } from "perf_hooks";

function loadDate(val: unknown, or: Date = new Date()): Date {
  const date = new Date(String(val));
  if (isNaN(Number(date)) || date < new Date("2015-01-01")) {
    return or;
  } else {
    return date;
  }
}

function loadString(val: unknown): string | undefined {
  if (typeof val !== "string") {
    return undefined;
  }

  return val;
}

function loadStringArray(val: unknown): string[] {
  if (Array.isArray(val) && val.every((x) => typeof x === "string")) {
    return val;
  }

  return [];
}

function getFileCreatedDate(file: string): Promise<Date> {
  return new Promise((resolve, reject) => {
    exec(
      `git log --reverse --format="%ad" -- ${file} | head -1`,
      (error, stdout) => {
        if (error) {
          return reject(error);
        }

        resolve(loadDate(stdout));
      }
    );
  });
}

function getFileModifiedDate(file: string): Promise<Date> {
  return new Promise((resolve, reject) => {
    exec(`git log -1 --format="%ad" -- ${file} | head -1`, (error, stdout) => {
      if (error) {
        return reject(error);
      }

      resolve(loadDate(stdout));
    });
  });
}

const contentDir = path.join(process.cwd(), "content");

function read(dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (error, files) => {
      if (error) {
        return reject(error);
      }

      resolve(files);
    });
  });
}

function readFile(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (error, buffer) => {
      if (error) {
        return reject(error);
      }

      resolve(buffer.toString());
    });
  });
}

function lstat(file: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.lstat(file, (error, stats) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(stats);
    });
  });
}

async function* paths(p: string, baseDir: string): AsyncGenerator<string> {
  const files = await read(path.join(baseDir, p));

  for (const base of files) {
    const file = path.join(p, base);
    const stat = await lstat(path.join(baseDir, file));

    if (stat.isDirectory()) {
      for await (const f of paths(file, baseDir)) {
        yield f;
      }
    } else {
      yield file;
    }
  }
}

async function loadTsFiles(dir: string): Promise<{ [key: string]: string }> {
  const map: { [key: string]: string } = {};
  const baseDir = path.join(process.cwd(), dir);

  for await (const file of paths("", baseDir)) {
    if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      map[path.join(dir, file)] = await readFile(path.join(baseDir, file));
    }
  }

  return map;
}

async function collect<T>(generator: AsyncGenerator<T>): Promise<T[]> {
  const arr: T[] = [];

  for await (const val of generator) {
    arr.push(val);
  }

  return arr;
}

const TYPES = ["article", "garden", "generic"] as const;
type PostType = typeof TYPES[number];

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
  draft: boolean;
}

function loadType(type: unknown): PostType {
  if (TYPES.includes(type as PostType)) {
    return type as PostType;
  }

  return "generic";
}

function loadBoolean(bool: unknown) {
  if (typeof bool === "boolean") {
    return bool;
  }

  if (bool === "false") {
    return false;
  }

  return Boolean(bool);
}

async function readMdxFile(
  slug: string
): Promise<{ content: string; mdxPath: string }> {
  const paths = [slug + ".mdx", slug + "/index.mdx", slug + "/_index.mdx"];

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
            remarkPrism,
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
    type: loadType(frontmatter.type),
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

export async function getAllPosts(): Promise<Post[]> {
  return await Promise.all(
    (await getAllPostSlugs()).map(async (slug) => await loadPostByName(slug))
  );
}
