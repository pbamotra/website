import "ts-node/register/transpile-only";

import path from "path";
// import { Post } from './types'

// Typescript support in static.config.js is not yet supported, but is coming in a future update!

console.log("Loading...");

// import { getData as getPostData } from "./src/containers/Post";

import { getAllPostSlugs, getData as getPostData } from "./src/lib/posts";
import { getAllTagNames, getData as getTagData } from "./src/lib/tags";
import { getData as getHomeData } from "./src/lib/home";
import { getData as getArchiveData } from "./src/lib/archive";

console.log("Finished importing...");

export default {
  entry: path.join(__dirname, "src", "index.tsx"),
  getRoutes: async () => {
    console.log("Getting all routes!");

    return [
      {
        path: "/",
        getData: getHomeData,
      },
      {
        path: "/archive",
        getData: getArchiveData,
      },
      ...(await getAllPostSlugs()).map((slug) => ({
        path: slug,
        template: "src/containers/Post",
        getData: () => getPostData(slug),
      })),
      ...(await getAllTagNames()).map((name) => ({
        path: `/tag/${name}`,
        template: "src/containers/Tag",
        getData: () => getTagData(name),
      })),
    ];
  },
  plugins: [
    "react-static-plugin-typescript",
    "react-static-plugin-sass",
    [
      require.resolve("react-static-plugin-source-filesystem"),
      {
        location: path.resolve("./src/pages"),
      },
    ],
    require.resolve("react-static-plugin-reach-router"),
    require.resolve("react-static-plugin-sitemap"),
  ],
};
