---
title: Resolve Markdown Links
---

At this time Hugo doesn't currently resolve direct links to markdown files.
This means that in a markdown file if you link to `/hello/index.md` it won't translate this linke into `/hello/` in the exported html file.

This means that your markdown files won't work as expected with Github, which goes against this Wiki's goals of [longtermism].

To combat this, you can add some logic into Hugo's `render-link.html` markdown hook.

{{< gist bennetthardwick f0a57ceb5be7460b5755eb4ee41967bc >}}

[longtermism]: ../longtermism.md
