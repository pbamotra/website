import React, { StatelessComponent, useState, useEffect } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { PostPreview } from "../components/post-preview"
import { Flipped, Flipper } from "react-flip-toolkit";
import { StaggerAnimationContainer } from "../components/stagger-wrapper";

export const BlogIndex: StatelessComponent<{ data: any, location: any }> = ({ data, location }) => {
  const posts = data.allMarkdownRemark.edges.map(x => x.node) as Post[];


  const [stateVisible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, [false])

  const isVisible = stateVisible === undefined ? true : stateVisible;


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
      <Flipper flipKey={isVisible} staggerConfig={{ default: { speed: .2 } }}>
        <StaggerAnimationContainer visible={isVisible}>
          <Flipped stagger="default" flipId="blog-title">
            <h1>Blog</h1>
          </Flipped>
          <PostPreview posts={posts} />
        </StaggerAnimationContainer>
      </Flipper>
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
  }
`
