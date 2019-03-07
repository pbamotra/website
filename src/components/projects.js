import React from "react"
import { rhythm } from "../utils/typography"

export default class Projects extends React.Component {
  render() {
    return (
      <div>
        {this.props.projects.map(({ node }) => {
          const title = node.title
          return (
            <div>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <a style={{ boxShadow: `none` }} href={node.link}>
                  {title}
                </a>
              </h3>
              <small>{node.date}</small>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.byline,
                }}
              />
            </div>
          )
        })}
      </div>
    )
  }
}
