#!/usr/bin/env node

const elasticlunr = require("elasticlunr");

const matter = require("gray-matter");
const marked = require("marked");
const PlainTextRenderer = require("marked-plaintext");

const renderer = new PlainTextRenderer();

const glob = require("glob");
const path = require("path");
const fs = require("fs");

const TITLE_CACHE = {};

if (process.argv.length !== 6) {
  console.error(
    "Usage create-index.js {contentDirectory} {directory} {outputFile} {baseUrl}"
  );
  process.exit(1);
}

const baseDirectory = path.join(process.cwd(), process.argv[2]);
const contentFolder = process.argv[3];
const outputFile = process.argv[4];
const baseUrl = process.argv[5];

const startRe = new RegExp(
  `^${quote(path.join(baseDirectory, contentFolder))}`
);

function quote(str) {
  return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
}

function getBreadcrumbsForPath(relativePath) {
  const crumbs = relativePath.split("/");

  const titledCrumbs = [];

  crumbs
    .filter((x) => !!x)
    .reduce((acc, a) => {
      const segment = `${acc}/${a}`;

      if (TITLE_CACHE[segment]) {
        titledCrumbs.push(TITLE_CACHE[segment]);
        return segment;
      }

      let indexPath;

      if (a === "index.md" || a === "_index.md") {
        return segment;
      }

      if (segment.endsWith(".md")) {
        indexPath = path.join(baseDirectory, contentFolder, segment);
      } else if (
        fs.existsSync(
          path.join(baseDirectory, contentFolder, segment, "_index.md")
        )
      ) {
        indexPath = path.join(
          baseDirectory,
          contentFolder,
          segment,
          "_index.md"
        );
      } else if (
        fs.existsSync(
          path.join(baseDirectory, contentFolder, segment, "index.md")
        )
      ) {
        indexPath = path.join(
          baseDirectory,
          contentFolder,
          segment,
          "index.md"
        );
      }

      let title = a;

      if (indexPath) {
        const { data } = matter(fs.readFileSync(indexPath));
        if (data.title) {
          title = data.title;
        }
      }

      TITLE_CACHE[segment] = title;
      titledCrumbs.push(title);

      return segment;
    }, "");

  return titledCrumbs.join(" » ");
}

const index = elasticlunr(function () {
  this.addField("title");
  this.addField("body");
  this.addField("breadcrumbs");
  this.setRef("id");
});

let id = 0;
for (const file of glob.sync(
  path.join(baseDirectory, contentFolder, "**/*.md")
)) {
  id++;

  const relativePath = file.replace(startRe, "");

  const content = fs.readFileSync(file);
  const { data, content: matterContent } = matter(content);

  const filteredContent = matterContent
    .split("\n")
    .map((x) => x.replace(/{{.*?}}/g, ""))
    .join("\n");

  const body = marked(filteredContent, { renderer });

  let title = data.title;

  if (!title) {
    const segments = file.split("/");
    title = segments[segments.length - 1];

    title.replace(/.md$/, "");
    title.replace(/^_index/, "index");

    if (title === "index") {
      title = segments[segments.length - 2];
    }
  }

  const breadcrumbs = getBreadcrumbsForPath(relativePath) || title;

  let href = `${baseUrl}/${relativePath
    .split("/")
    .map((x) => x.replace(/.md$/, ""))
    .filter((x) => !!x && !(x === "index" || x === "_index"))
    .join("/")}`;

  if (!href.endsWith('/')) {
    href += '/';
  }

  index.addDoc({
    id,
    title,
    body,
    breadcrumbs,
    href,
  });
}

fs.writeFileSync(outputFile, JSON.stringify(index.toJSON()));

console.log(`Added ${id} docs to index!`);
