import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { rhythm } from "../utils/typography"

class Layout extends React.Component {
  render() {
    const { location, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    const blogPath = `${__PATH_PREFIX__}/blog`
    let header

    let blogLink;

    if (location.pathname === rootPath || (location.pathname !== blogPath && location.pathname.startsWith(blogPath))) {
      blogLink = <Link to={blogPath} style={{ fontSize: rhythm(0.8) }}>Blog</Link>;
    }

    const profile = <StaticQuery query={avatarQuery} render={data => <Image
      fixed={data.avatar.childImageSharp.fixed}
      style={{
        minWidth: 50,
        borderRadius: `100%`,
      }}
      imgStyle={{
        borderRadius: `50%`,
      }} />}
    />

    if (location.pathname === rootPath) {
      header = (
        <div
          style={{
            marginBottom: rhythm(2.5),
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
        <div style={{marginBottom: rhythm(0.25)}}>
            {profile}
        </div>
          {blogLink}
        </div>
      )
    } else {
      header = (
        <div
          style={{
            marginTop: 0,
            marginBottom: rhythm(1.5),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
              backgroundImage: `none`
            }}
            to={`/`}
          >
            {profile}
          </Link>
          {blogLink}
        </div>
      )
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <header>{header}</header>
        <main>{children}</main>
        <footer style={{ opacity: 0.5, marginTop: rhythm(4), textAlign: 'center' }}>
          The result of torturous tinkering and misplaced motivation. I'm just waiting for things to break.
        </footer>
      </div>
    )
  }
}

export default Layout

const avatarQuery = graphql`
  query AvatarQuery {
    avatar: file(absolutePath: { regex: "/profile.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`