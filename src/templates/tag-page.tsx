
import React, { StatelessComponent } from "react"
import { Link, graphql } from "gatsby"
import Helmet from "react-helmet"
import Layout from "../components/layout"
import PostPreview from "../components/post-preview";

const TagPage: StatelessComponent<{ data: any, location: any, pageContext: any }> = ({ data, location, pageContext }) => {

    const posts = data.allMarkdownRemark.edges.map(x => x.node);
    const title = data.site.siteMetadata.title

    return <Layout location={location}>
        <Helmet title={title} />
        <h2>
            {data.allMarkdownRemark.totalCount} posts tagged with "{pageContext.tag}"
        </h2>
        <PostPreview posts={posts}></PostPreview>
        <Link to={'/blog/tags'}>
            Browse All Tags
        </Link>
    </Layout>
}

export default TagPage

export const pageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] }, draft: { ne: true } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            byline
          }
        }
      }
    }
  }
`