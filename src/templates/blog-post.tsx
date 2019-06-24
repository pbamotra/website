import React, {StatelessComponent} from "react"
import Disqus from 'gatsby-plugin-disqus'
import {Link, graphql} from "gatsby"
import styled from 'styled-components';
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import {rhythm, scale} from "../utils/typography"
import {StaggerWrapper, Stagger} from "staggered";
import MDXRenderer from 'gatsby-mdx/mdx-renderer';
import {Helmet} from 'react-helmet';

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

export const BlogPost: StatelessComponent<{data: any, location: any, pageContext: any, isAmp: boolean}> = ({
  data,
  location,
  pageContext,
  isAmp = false
}) => {
  const post = data.mdx;
  const {
    title,
    byline,
    excerpt,
    manualTimestamp,
    manualTimestampDate,
    comments
  } = post.frontmatter;
  const {previous, next} = pageContext;
  const tags = post.frontmatter.tags || [];

  const {date, createdAt, modifiedAt} = post.fields;

  return (
    <Layout location={location}>
      {!isAmp &&
        <Helmet>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.2/katex.min.css" />
        </Helmet>
      }

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": location.url
          },
          "headline": title,
          "image": [],
          "datePublished": manualTimestamp || createdAt,
          "dateModified": modifiedAt,
          "author": {
            "@type": "Person",
            "name": "Bennett hardwick"
          },
          "description": byline || excerpt
        })}
      </script>

      <SEO
        title={title}
        description={byline || excerpt}
      />

      <StaggerWrapper shouldStagger={!isAmp}>
        <Stagger staggerId="fade-in">
          <h1>{title}</h1>
        </Stagger>
        <Stagger staggerId="fade-in-2">
          <p
            style={{
              ...scale(-1 / 5),
              display: `block`,
              marginBottom: rhythm(1),
            }}
          >
            {manualTimestampDate || date}
            {tags.length ?
              <>
                &nbsp;-&nbsp;<TagList>
                  {
                    tags.map(tag => <span key={tag}>
                      <Link to={`/blog/tag/${tag}`}>
                        {tag}
                      </Link>
                    </span>)
                  }
                </TagList>
              </>
              : undefined}
          </p>
        </Stagger>
        <Stagger staggerId="fade-in-3">
          <MDXRenderer>
            {post.code.body}
          </MDXRenderer>
        </Stagger>
      </StaggerWrapper>
      <Bio isAmp={isAmp} />

      <ul
        style={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-between`,
          listStyle: `none`,
          padding: 0,
        }}
      >
        <li style={{flex: "1 1 0", marginRight: rhythm(0.25)}}>
          {previous && (
            <Link to={previous.fields.slug} rel="prev">
              ← {previous.frontmatter.title}
            </Link>
          )}
        </li>
        <li style={{flex: "1 1 0", marginLeft: rhythm(0.25)}}>
          {next && (
            <Link to={next.fields.slug} rel="next">
              {next.frontmatter.title} →
              </Link>
          )}
        </li>
      </ul>
      {(!isAmp && comments) ? <Disqus
        identifier={post.id}
        title={title}
        url={`${'https://bennetthardwick.com'}${location.pathname}`}
      /> : ''}
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
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      code {
        body
      }
      fields {
        createdAt,
        date: createdAt(formatString: "MMMM DD, YYYY")
        modifiedAt
      }
      frontmatter {
        title
        manualTimestamp: date,
        manualTimestampDate: date(formatString: "MMMM DD, YYYY")
        byline
        tags
        comments
      }
    }
  }
`
