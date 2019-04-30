import React from "react"

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
        <span dangerouslySetInnerHTML={{ __html: furiganaToHTML(node) }} />
      ) : (
        node
      )
    )}
  </>
)
