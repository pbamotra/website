import Typography from "typography"
import Theme from "typography-theme-fairy-gates"

import "../css/prism-code-highlighting.css"

Theme.overrideThemeStyles = () => {
  return {
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
      backgroundImage: "none",
    },
    "h3 a": {
      color: "inherit",
      backgroundImage: "none",
    },
  }
}

const typography = new Typography(Theme)

typography.options.color = "red"

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
