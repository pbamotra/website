import React, { StatelessComponent } from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import MDXRenderer from "gatsby-mdx/mdx-renderer"
import { Helmet } from "react-helmet"

const TagList = styled.span`
  display: inline-block;
  list-style: none;
  margin: 0;
  padding: 0;
  span {
    display: inline-block;
    margin-right: 10px;
    padding: 0;
  }
`

const BlogPost: StatelessComponent<{
  data: any
  location: any
  pageContext: any
}> = ({ data, location, pageContext }) => {
  const post = data.mdx
  const { previous, next } = pageContext
  const tags = post.frontmatter.tags || []

  return (
    <Layout location={location}>
      <Helmet>
        <style>{`amp-anim img { object-fit: contain; }`}</style>
        <script type="application/ld+json">
          {`{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://bennetthardwick.com/blog/${pageContext.slug}"
  },
  "headline": "${post.frontmatter.title}",
  "datePublished": "${new Date(post.frontmatter.date).toISOString()}",
  "dateModified": "${new Date(post.frontmatter.date).toISOString()}",
  "author": {
    "@type": "Person",
    "name": "Bennett Hardwick"
  },
   "publisher": {
    "@type": "Organization",
    "name": "bennetthardwick",
    "logo": {
      "@type": "ImageObject",
      "url": "https://bennetthardwick.com/og-image.jpg"
    }
  },
  "description": "${post.frontmatter.byline || post.excerpt}"
}`}
        </script>
      </Helmet>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.byline || post.excerpt}
      />
      <h1>{post.frontmatter.title}</h1>
      <p
        style={{
          ...scale(-1 / 5),
          display: `block`,
          marginBottom: rhythm(1),
        }}
      >
        {post.frontmatter.date}
        {tags.length ? (
          <>
            &nbsp;-&nbsp;
            <TagList>
              {tags.map(tag => (
                <span key={tag}>
                  <Link to={`/blog/tag/${tag}`}>{tag}</Link>
                </span>
              ))}
            </TagList>
          </>
        ) : (
          undefined
        )}
      </p>
      <MDXRenderer>{post.code.body}</MDXRenderer>
      <Bio isAmp={true} />

      <ul
        style={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-between`,
          listStyle: `none`,
          padding: 0,
        }}
      >
        <li style={{ flex: "1 1 0", marginRight: rhythm(0.25) }}>
          {previous && (
            <Link to={previous.fields.slug} rel="prev">
              ← {previous.frontmatter.title}
            </Link>
          )}
        </li>
        <li style={{ flex: "1 1 0", marginLeft: rhythm(0.25) }}>
          {next && (
            <Link to={next.fields.slug} rel="next">
              {next.frontmatter.title} →
            </Link>
          )}
        </li>
      </ul>
    </Layout>
  )
}

export default BlogPost

export const pageQuery = graphql`
  query BlogPostAmpBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      code {
        body
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        byline
        tags
      }
    }
  }
`
