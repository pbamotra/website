import React, {StatelessComponent} from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import About from "../components/about"

export const Home: StatelessComponent<{data: any, location: any}> = ({data, location}) => {
  return (
    <Layout location={location}>
      <SEO
        title="Projects"
        keywords={[`projects`, `gatsby`, `javascript`, `react`]}
      />
      <About />
    </Layout>
  )
}

export default Home;

export const pageQuery = graphql`
  query {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true } } fileAbsolutePath: { regex: "^\/blog\/" } }
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
