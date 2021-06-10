const withMDX = require("@next/mdx")({
  extension: /\.mdx$/,
});

module.exports = {
  ...withMDX({
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  }),
  async redirects() {
    return [
      {
        source:
          "/blog/2018-12-07-introduction-to-rust-through-advent-of-code-2018/",
        destination: "/aoc-rust-intro",
        permanent: true,
      },
      {
        source: "/blog/introduction-to-rust-through-advent-of-code-2018/",
        destination: "/aoc-rust-intro",
        permanent: true,
      },
      {
        source: "/blog/fixing-broken-japanese-fonts-arch-linux/",
        destination: "/arch-japanese-fonts",
        permanent: true,
      },
      {
        source: "/blog/creating-a-blazingly-fast-blog-without-js-or-gatsby/",
        destination: "/creating-a-blazingly-fast-blog-without-js-or-gatsby",
        permanent: true,
      },
      {
        source: "/blog/dont-use-boxed-trait-objects-for-struct-internals/",
        destination: "/dont-use-boxed-trait-objects-for-struct-internals",
        permanent: true,
      },
      {
        source: "/blog/why-you-should-be-force-pushing-your-branches/",
        destination: "/force-push-your-branches",
        permanent: true,
      },
      {
        source: "/blog/recoil-js-clone-from-scratch-in-100-lines/",
        destination: "/recoil-from-scratch",
        permanent: true,
      },
      {
        source: "/wiki/rust/rust-downcast-trait-object/",
        destination: "/rust/downcast-trait-object",
        permanent: true,
      },
      {
        source: "/blog/vim-as-an-ide-for-web-developers/",
        destination: "/vim-webdev-ide",
        permanent: true,
      },
      {
        source:
          "/blog/writing-safe-efficient-parallel-native-node-extensions-in-rust-and-neon/",
        destination: "/writing-native-node-extensions-in-rust",
        permanent: true,
      },
      {
        source: "/amp/:slug*",
        destination: "/:slug*/",
        permanent: true,
      },
    ];
  },
};
