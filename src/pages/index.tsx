import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { PostPreview } from "../components/post-preview"
import About from "../components/about"
import Projects from "../components/projects"

export default class Home extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    const projects = data.allProjectsYaml.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Projects"
          keywords={[`projects`, `gatsby`, `javascript`, `react`]}
        />

        <About />

        <h2>Projects</h2>
        <Projects projects={projects} />

        <h2>Recent Posts</h2>
        <PostPreview posts={posts.slice(0, 3)} />
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true } } }
      limit: 1000
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            byline
          }
        }
      }
    }
    allProjectsYaml {
      edges {
        node {
          title
          byline
          date
          link
        }
      }
    }
  }
`
