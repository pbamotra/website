import "ts-node/register/transpile-only";

import path from "path";

import { getAllPostSlugs, getData as getPostData } from "./src/lib/posts";
import { getAllTagNames, getData as getTagData } from "./src/lib/tags";
import { getData as getHomeData } from "./src/lib/home";
import { getData as getArchiveData } from "./src/lib/archive";

export default {
  entry: path.join(__dirname, "src", "index.tsx"),
  generateSourceMaps: true,
  getRoutes: async () => {
    return [
      {
        path: "/",
        getData: getHomeData,
      },
      {
        path: "/archive/",
        getData: getArchiveData,
      },
      ...(await getAllPostSlugs()).map((slug) => ({
        path: slug,
        template: "src/containers/Post",
        getData: () => getPostData(slug),
      })),
      ...(await getAllTagNames()).map((name) => ({
        path: `/tag/${name}/`,
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
    require.resolve("react-static-plugin-react-router"),
    require.resolve("react-static-plugin-sitemap"),
  ],
};
