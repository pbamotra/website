---
layout: post
title: Interactive JavaScript Code Snippets for Jekyll
byline: An interactive alternative to JavaScript code snippets that integrates well with Jekyll.
date: 2018-09-03
tags: [c, beginner]
comments: false
console: true
---
I've always liked those interactive code snippets that you see on places like StackOverflow and the MDN. So much so that after using the amazing 
[thebookofshaders](https://thebookofshaders.com/) editor, I decided to create my own.

<interactive-console>
    console.log('This is an interactive code snippet!')
</interactive-console>


## How it works
Just like [thebookofshaders](https://thebookofshaders.com/), I used [codemirror](https://codemirror.net/) as the editor and then pipe the value through a `document.eval` inside an `iframe`. This means that even destructive operations are performed, since the code is sanboxed in an `iframe` it, it won't affect the page at all.

<interactive-console>
    document.body.style.backgroundColor = 'red';
    document.body.innerHTML = 'BREAKING THE PAGE!';
</interactive-console>

You also get access to most JavaScript methods. This means you can `eval` inside an `eval` inside an `eval`.

<interactive-console>
    setTimeout(() => console.log(eval('eval(\'10\')')), 200);
</interactive-console>

## Jekyll
The main goal for the console was to be used on this blog. Check out how easy it is to create a simple snippet:

```html
<interactive-console>
    (() => 1234)()
</interactive-console>
```

<interactive-console>
    (() => 1234)()
</interactive-console>

### Installation
It's really easy to install the snippet as well. Inside the `<head>` of your page, simply add the library. I added the following inside my theme's `_includes/head.html` file.
```html
{ % if page.console % }
<script src="{{ '/assets/interactive-console.js' | relative_url }}"></script>
{ % endif % }
```

Then, on every page that should include interactive snippets, add the following front matter: 

```
---
console: true
---
```

If you want to include the console on your site too, you can visit the [GitHub Repo](https://github.com/bennetthardwick/interactive-javascript-console) or download the bundle by clicking [here](https://raw.githubusercontent.com/bennetthardwick/interactive-javascript-console/master/dist/bundle.js).