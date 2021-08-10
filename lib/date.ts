import { exec } from "child_process";
import { loadDate } from "./parse";

export function getFileCreatedDate(file: string): Promise<Date> {
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

export function getFileModifiedDate(file: string): Promise<Date> {
  return new Promise((resolve, reject) => {
    exec(`git log -1 --format="%ad" -- ${file} | head -1`, (error, stdout) => {
      if (error) {
        return reject(error);
      }

      resolve(loadDate(stdout));
    });
  });
}
