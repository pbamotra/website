---
layout: post
title: Fixing Japanese on Arch Linux
byline: How to configure default system fonts and input for working with Japanese on Arch Linux.
date: 2018-08-30
tags: [linux, beginner, japanese]
comments: false
---

Setting up fonts for non-latin languages can be a bit difficult on Arch Linux. I find that every time I configure a new system I forget how to make it work perfectly,
and I end up wasting hours trying to find the right answers. So I'm writing this as a reference in case I ever need to do it again.

## Japanese System Fonts

The first issue I'll normally run into is broken fonts. After finishing up an install, non-latin fonts look like this:

```xml
<fontconfig>
	<alias>
		<family>serif</family>
		<prefer>
			<family>Noto Serif CJK JP</family>
		</prefer>
	</alias>

	<alias>
		<family>sans-serif</family>
		<prefer>
			<family>Noto Sans CJK JP</family>
		</prefer>
	</alias>

	<alias>
		<family>monospace</family>
		<prefer>
			<family>Noto Sans Mono CJK JP</family>
		</prefer>
	</alias>
</fontconfig>
```

