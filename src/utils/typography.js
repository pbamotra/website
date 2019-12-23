import Typography from 'typography'
import Theme from 'typography-theme-fairy-gates'
import CodePlugin from 'typography-plugin-code';

import "../css/prism-code-highlighting.css"

Theme.plugins = [ new CodePlugin() ]

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
    '.gatsby-highlight': {
      marginBottom: '1.5rem'
    }
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
