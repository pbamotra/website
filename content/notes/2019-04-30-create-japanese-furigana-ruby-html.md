---
title: Japanese Furigana with React
type: text
category: javascript
---
The HTML standard has this great tag called `<ruby>` for displaying [the pronounciation of East Asian characters](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby).
This makes it super easy to add Furigana to Japanese Kanji using Javascript, HTML and React.

```jsx
const furiganaRe = /[\u4e00-\u9faf]*{.*?}/gm
const furiganaToHTML = string =>
  string.replace(furiganaRe, x => {
    let [base, furigana] = x.slice(0, -1).split("{")
    return `<ruby>${base}<rt>${furigana}</rt></ruby>`
  });

export const Furigana = ({ children, ...rest }) => (
  <>
    {React.Children.map(children, node =>
      typeof node === "string" ? (
        <span dangerouslySetInnerHTML={{
            __html: furiganaToHTML(node)
        }} />
      ) : (
        node
      )
    )}
  </>
)

/* USAGE:
 * <Furigana>
 *  人間{にんげん}を食{た}べる
 * </Furigana>
 */
```