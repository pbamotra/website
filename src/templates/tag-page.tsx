import React, { StatelessComponent } from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import PostPreview from "../components/post-preview"
import SEO from "../components/seo"
import styled from "styled-components"

const Description = styled.p`
  width: 80%;
  display: block;
  margin: 45px auto;
  font-style: italic;
  text-align: center;
  font-size: 0.9rem;
`

const TagPage: StatelessComponent<{
  data: any
  location: any
  pageContext: any
}> = ({ data, location, pageContext }) => {
  const posts = data.allMdx.edges.map(x => x.node)
  const description = data.tagsYaml && data.tagsYaml.description

  return (
    <Layout location={location}>
      <SEO title={`Posts tagged ${pageContext.tag}`} />
      <h2>
        {data.allMdx.totalCount} posts tagged with "{pageContext.tag}"
      </h2>
      {description && <Description>{description}</Description>}
      <PostPreview posts={posts} />
      <div>
        <Link to={"/blog/tags"}>Browse All Tags</Link>
      </div>
    </Layout>
  )
}

export default TagPage

export const pageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
      }
    }

    tagsYaml(key: { eq: $tag }) {
      description
    }

    allMdx(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { tags: { in: [$tag] }, draft: { ne: true } }
        fileAbsolutePath: { regex: "^/blog/" }
      }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            date: createdAt(formatString: "MMMM DD, YYYY")
          }
          frontmatter {
            title
            created: date(formatString: "MMMM DD, YYYY")
            byline
          }
        }
      }
    }
  }
`
