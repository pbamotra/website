---
title: Fast link loading
---

Using a simple [JavaScript] snippet you can make navigation of static sites feel almost instant.

I talk about this a little bit in [a blog post][bfss] about building this site (at least it's Zola incarnation).

Here's the snippet:

```js
// A map to store all the links that have already been
// fetched
const FETCHED = {};

// Select all the links on the page. This could probably be
// constrained to just inbound links, but let's try it with
// all links instead.
Array.from(document.querySelectorAll("a")).forEach((element) => {
  element.addEventListener("mouseenter", function addLink() {
    // If this link has already been fetched before, don't worry
    // about fetching it again.
    if (FETCHED[element.href]) {
      return;
    }

    FETCHED[element.href] = true;


    // Create a <link rel="prerender"> element to prerender
    // the target page
    const link = document.createElement("link");
    link.href = element.href;
    link.rel = "prerender";
    document.head.appendChild(link);

    element.removeEventListener("mouseenter", addLink);
  });
});
```

[bfss]: ../blog/creating-a-blazingly-fast-blog-without-js-or-gatsby/index.md
[JavaScript]: ./javascript/_index.md
