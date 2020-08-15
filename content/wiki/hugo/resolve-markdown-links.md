---
title: Resolve Markdown Links
---

At this time Hugo doesn't currently resolve direct links to markdown files.
This means that in a markdown file if you link to `/hello/index.md` it won't translate this linke into `/hello/` in the exported html file.

This means that your markdown files won't work as expected with Github, which goes against this Wiki's goals of [longtermism].

To combat this, you can add some logic into Hugo's `render-link.html` markdown hook.

```html
{{/* The destination of the link. Bind to a variable for convenience. */}}
{{ $path := .Destination }}

{{/* If the link isn't a relative link or is an outbound link,
     don't rewrite /*}}
{{ if or (hasPrefix $path "./") (not (hasPrefix $path "http")) (hasPrefix $path "../") }}

  {{ $file := .Page.File.LogicalName }}

  {{/* If the link has a hash, extract it */}}
  {{ $hash := index (findRE "#(.*)$" $path) 0 }}

  {{ if $hash }}
    {{ $path = replaceRE (printf "%s$" $hash) "" $path }}
  {{ else }}
    {{ $hash = "" }}
  {{ end }}

  {{/* Non-index files are outputted as directories with 
       index files, so these links need to start with `../` */}}
  {{ if and (not (or (eq $file "index.md") (eq $file "_index.md"))) (strings.HasSuffix $file ".md") }}
    {{ $path = path.Join "../" $path }}
  {{ end }}

  {{/* Remove _index / index and make sure link ends with trailing slash */}}
  {{ $path = path.Join .Page.RelPermalink $path }}
  {{ $path = replaceRE "/index.md$" "/" $path }}
  {{ $path = replaceRE "/_index.md$" "/" $path }}
  {{ $path = replaceRE ".md$" "/" $path }}
  {{ $path = path.Join $path "/" }}
  {{ $path = printf "%s/%s" $path $hash }}

  {{/* A special case for the wiki, if the link starts with
       a hash it's a tag, so style it differently */}}
  {{ $tag := hasPrefix .Text "#" }}
  
  <a class="ref{{ if $tag }}tag{{end}}"href="{{ $path | safeURL }}">{{ .Text | safeHTML }}</a>
{{ else }}
  <a href="{{ .Destination | safeURL }}" target="_blank" rel="noreferrer">{{ .Text | safeHTML }}</a>
{{ end }}
```

[longtermism]: ../longtermism.md
