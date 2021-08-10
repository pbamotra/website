import fs from "fs";
import path from "path";

export function read(dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (error, files) => {
      if (error) {
        return reject(error);
      }

      resolve(files);
    });
  });
}

export function readFile(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (error, buffer) => {
      if (error) {
        return reject(error);
      }

      resolve(buffer.toString());
    });
  });
}

export function lstat(file: string): Promise<fs.Stats> {
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

export async function* paths(
  p: string,
  baseDir: string
): AsyncGenerator<string> {
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

export async function loadTsFiles(
  dir: string
): Promise<{ [key: string]: string }> {
  const map: { [key: string]: string } = {};
  const baseDir = path.join(process.cwd(), dir);

  for await (const file of paths("", baseDir)) {
    if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      map[path.join(dir, file)] = await readFile(path.join(baseDir, file));
    }
  }

  return map;
}
