import fs from "fs";
import { bundleMDX } from "mdx-bundler";
import path from "path";
import { remarkMdxImages } from "remark-mdx-images";
import remarkFrontmatter from "remark-frontmatter";
import { remarkMdxFrontmatter } from "remark-mdx-frontmatter";

import { exec } from "child_process";

function loadDate(val: unknown, or: Date = new Date()): Date {
  console.log("Parsing", val);

  const date = new Date(String(val));
  if (isNaN(Number(date)) || date < new Date("2015-01-01")) {
    return or;
  } else {
    return date;
  }
}

function getFileCreatedDate(file: string): Promise<Date> {
  return new Promise((resolve, reject) => {
    exec(
      `git log --reverse --format="%ad" -- ${file} | head -1`,
      (error, stdout) => {
        if (error) {
          return reject(error);
        }

        console.log(file);

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

type PostType = "article" | "generic";

interface Post {
  code: string;
  title: string;
  frontmatter: Record<string, unknown>;
  slug: string;
  createdAt: number;
  modifiedAt: number;
  type: PostType;
}

function loadType(type: unknown): PostType {
  if (type === "article") {
    return "article";
  }

  return "generic";
}

async function loadPostByName(name: string): Promise<Post> {
  const mdxPath = path.join(
    contentDir,
    (name.endsWith("/") ? name.slice(0, -1) : name) + ".mdx"
  );

  const content = await readFile(mdxPath);

  const { code, frontmatter } = await bundleMDX(content, {
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
        },
        publicPath: "/img/",
        write: true,
      };
    },
  });

  const modifiedAt = Number(
    loadDate(frontmatter.modifiedAt, await getFileModifiedDate(mdxPath))
  );

  const createdAt = Number(
    loadDate(frontmatter.createdAt, await getFileCreatedDate(mdxPath))
  );

  const title = frontmatter.title ?? name;

  return {
    slug: `/${name}`,
    modifiedAt,
    createdAt,
    frontmatter,
    code,
    title,
    type: loadType(frontmatter.type),
  };
}

export async function getPostByPath(file: string): Promise<Post> {
  return await loadPostByName(file);
}

export async function getRecentPosts(): Promise<Post[]> {
  return (await getAllPosts())
    .filter((x) => x.type === "article")
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function getAllPostsSorted(): Promise<Post[]> {
  return (await getAllPosts()).sort((a, b) => a.createdAt - b.createdAt);
}

export async function getAllPosts(): Promise<Post[]> {
  const posts: Post[] = [];

  for await (const file of paths("", contentDir)) {
    if (file.endsWith(".mdx")) {
      posts.push(await loadPostByName(file.slice(0, -".mdx".length)));
    }
  }

  return posts;
}
