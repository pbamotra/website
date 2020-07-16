---
title: About
---

This is a wiki is inspired by the concept of an [exobrain] as well as [longtermism].

It's built using [hugo] but it's source is intended to be easily readable by being completely backed by markdown.
As such, [hugo] syntax that is not supported by common mark (such as [shortcodes]) are used sparingly.
This means that this wiki could be [viewed on Github], or as an [mdbook], or with tool in the future that supports markdown.

The code for this wiki lives in a Github repository ([bennetthardwick/website]) and is free to be forked, copied or stolen.
At the bottom of each page is an "edit on Github" link in case you want to fix anything up.

This [hugo] theme has several features which aid the wiki:
  - bidirectional linking
    - this is in the form of the "Linked references" section that appears at the bottom of the page
    - sections with "Nested references" link to their children and their children to the parents 
  - pre-rendering pages on hover
    - this makes navigation feel almost instant
  - resolve markdown links
    - not possible with vanilla [hugo], this is done to avoid using [shortcodes] for linking
  - search
    - this hasn't been done yet, but once done will allow you to quickly jump to arbitrary pages
    

[exobrain]: ./exobrain.md
[hugo]: ./hugo.md
[shortcodes]: ./hugo.md#shortcodes
[mdbook]: ./mdbook.md
[longtermism]: ./longtermism.md
[bennetthardwick/website]: https://github.com/bennetthardwick/website/tree/development/content/wiki
[viewed on Github]: https://github.com/bennetthardwick/website/blob/development/content/wiki/_index.md
