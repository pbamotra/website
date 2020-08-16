---
title: About the Wiki
---

This is a wiki is inspired by the concept of an [exobrain] as well as [longtermism].

It's built using [hugo] but it's source is intended to be easily readable by being completely backed by markdown.
As such, [hugo] syntax that is not supported by common mark (such as [shortcodes]) are used sparingly.
This means that this wiki could be [viewed on Github], or as an [mdbook], or with tool in the future that supports markdown.

The code for this wiki lives in a Github repository ([bennetthardwick/website]) and is free to be forked, copied or stolen.
At the bottom of each page is an "edit on Github" link in case you want to fix anything up.

## Feature Overview

This [hugo] theme has several features which aid the wiki:

- bidirectional linking
  - this is in the form of the "Linked references" section that appears at the bottom of the page
  - sections with "Nested references" link to their children and their children to the parents
  - references are highlighted when jumping
- pre-rendering pages on hover
  - this makes navigation feel almost instant, see [fast-link-loading]
- resolve markdown links
  - not possible with vanilla [hugo], this is done to avoid using [shortcodes] for linking
- search
  - you can search through the wiki using the above search bar

## How To Use

In order to best use this site there's a few things you should know.

### References

When you link to another page you create a reference to that page.
References can be in the form of links which are surrounded by square brackets, or tags which start with the pound symbol.
Any other links are external and might take a bit longer to load.

When you reference a page you create a bidirectional link.
These links show in the "linked references" section on the page.

### Parent

Parent pages are special pages that contain other pages - they can essentially be thought of as groups.

A parent page displays it's children under the "nested references" section.

### Search

You can search through the wiki using the search bar at the top of the page.
You can also press `/` to open the search and `Esc` to close it.
Pressing tab and enter will allow you to select any of the entries.

---

That's it! If you're looking for a place to start, try [rust]. Have fun!

[#todo]: ./todo.md
[rust]: ./rust/_index.md
[bennetthardwick/website]: https://github.com/bennetthardwick/website/tree/development/content/wiki
[exobrain]: ./exobrain.md
[fast-link-loading]: ./fast-link-loading.md
[hugo]: ./hugo/_index.md
[longtermism]: ./longtermism.md
[mdbook]: ./mdbook.md
[shortcodes]: ./hugo/_index.md#shortcodes
[viewed on github]: https://github.com/bennetthardwick/website/blob/development/content/wiki/_index.md
