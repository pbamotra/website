+++
title = "There's no place for JavaScript on the modern web"
description = "TODO"
draft = true
[taxonomies]
tags = ["rust","webdev","beginner"]
+++

Gatsby, React and static websites seem to be all the rage at the moment, and for the most part I've been on the bandwagon.

For [over a year](https://github.com/gatsbyjs/gatsby/pull/12693) I've been working daily helping maintain a large Gatsby site,
working on a Gatsby personal site and enjoying flexing my [Gatsby merch](https://store.gatsbyjs.org/).
But after reading an excellent article by Tom MacWright ([Second-guessing the modern web](https://macwright.org/2020/05/10/spa-fatigue.html)) I too started to think that maybe life should be simpler.

## JavaScript costs seconds

Blazing fast websites have a lot of logic that tries to make them fast.
They have routines for fetching data, pre-fetching data, caching data and rendering data, all in the hopes of delivering the fastest most seamless experience possible.

However,

### Prerender your pages without JavaScript

You can add this tag to you head

```html
<head>
  <link rel="prerender" href="https://bennetthardwick.com/about/" />
</head>
```

## No service worker, no worries

Something that pained

## What do you lose when you leave?

## Conclusion

- Javascript is expensive. Time spent downloading, parsing and evaluating the code can add seconds to interactivity
- Browsers have built in support for pre-fetching pages which can be used to speed up navigation



