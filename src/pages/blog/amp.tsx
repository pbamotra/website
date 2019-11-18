import React, {StatelessComponent} from "react"
import {graphql} from "gatsby"
import Layout from "../../components/layout"
import SEO from "../../components/seo"
import {PostPreview} from "../../components/post-preview"

export const BlogIndex: StatelessComponent<{data: any, location: any}> = ({data, location}) => {
  const posts = data.allMdx.edges.map(x => x.node) as Post[];
  return (
    <Layout location={location}>
      <SEO
        title="Blog"
        keywords={[
          `blog`,
          `javascript`,
          `typescript`,
          `programming`,
          "bennetthardwick",
        ]}
      />
      <h1>Blog</h1>
      <PostPreview posts={posts} />
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(
      sort: { fields: [fields___sortTime], order: DESC }
      filter: { fields: { draft: { ne: true } } fileAbsolutePath: { regex: "^\/blog\/" } }
      limit: 1000
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
            date: createdAt(formatString: "MMMM DD, YYYY")
          }
          frontmatter {
            created: date(formatString: "MMMM DD, YYYY")
            title
            byline
          }
        }
      }
    }
  }
`
