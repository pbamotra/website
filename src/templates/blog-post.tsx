import React, { StatelessComponent, useState, useEffect } from "react"
import { Link, graphql } from "gatsby"
import styled from 'styled-components';
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import { Flipper, Flipped } from "react-flip-toolkit";
import { StaggerAnimationContainer } from "../components/stagger-wrapper";

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

const BlogPost: StatelessComponent<{ data: any, location: any, pageContext: any }> = ({
  data,
  location,
  pageContext
}) => {
  const post = data.markdownRemark;
  const { previous, next } = pageContext;
  const tags = post.frontmatter.tags || [];

  const [stateVisible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, [false])

  const isVisible = stateVisible === undefined ? true : stateVisible;

  return (
    <Layout location={location}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.byline || post.excerpt}
      />
      <Flipper flipKey={isVisible} staggerConfig={{ default: { speed: .1 }}} >
        <StaggerAnimationContainer visible={isVisible}>
          <Flipped stagger="default" flipId="fade-in">
            <h1>{post.frontmatter.title}</h1>
          </Flipped>
          <Flipped stagger="default" flipId="fade-in-2">
            <p
              style={{
                ...scale(-1 / 5),
                display: `block`,
                marginBottom: rhythm(1),
              }}
            >
              {post.frontmatter.date}
              {tags.length ?
                <>
                  &nbsp;-&nbsp;<TagList>
                    {
                      tags.map(tag => <span>
                        <Link to={`/blog/tag/${tag}`}>
                          {tag}
                        </Link>
                      </span>)
                    }
                  </TagList>
                </>
                : undefined}
            </p>
          </Flipped>
          <Flipped stagger="default" flipId="fade-in-3">
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </Flipped>
        </StaggerAnimationContainer>
      </Flipper>
      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <Bio />

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
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        byline
        tags
      }
    }
  }
`
