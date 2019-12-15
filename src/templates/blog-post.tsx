import React, { StatelessComponent } from "react"
import Disqus from "gatsby-plugin-disqus"
import { Link, graphql } from "gatsby"
import styled from "styled-components"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import { MDXRenderer } from "gatsby-plugin-mdx"
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

const SizedContainer = styled.div`
  max-width: ${rhythm(18)};

  @media (max-width: 1400px) {
    max-width: 100%;
  }
`

const Row = styled.div`
  display: flex;

  @media (max-width: 1400px) {
    flex-direction: column;
  }

  @media (min-width: 1400px) {
    &:after {
     content: '';
     left: 564px;
     z-index: -1;
     position: fixed;
     right: 0;
     background: #f5f2f0;
     top: 0;
     bottom: 0;
    }
  }
`
const Column = styled.div`
  @media (min-width: 1400px) {
    flex-grow: 1;
    background: #f5f2f0;
    overflow: auto;

    :not(:first-child) {
      code {
        font-size: ${rhythm(0.5)};
      }

      pre[class*="language-"] {
        padding-top: 0;
        padding-bottom: 0;
        margin: 0.5em 0;
        overflow: auto;
      }
    }

    :first-child {
      max-width: ${rhythm(18)};
      margin-right: 20px;
      background: none;
      flex-shrink: 0;

      > p,
      li,
      a {
        font-size: ${rhythm(0.6)};

        > code {
          font-size: ${rhythm(0.45)};
        }
      }
    }
  }
`

const SideBySideWrapper = props => {
  const children = []

  let text = []
  let code = []

  const lastIndex = props.children.length - 1

  React.Children.forEach(props.children, (child, i) => {
    if (React.isValidElement(child) && !!child.props["data-language"]) {
      let children = (child.props as any).children
      if (!Array.isArray(children)) {
        children = children.props.children

        if (!children.props.children) {
          return code.push("")
        }
      }

      return code.push(child)
    }

    if (code.length > 0 || i == lastIndex) {
      children.push(
        <Row>
          <Column>{text}</Column>
          <Column>{code}</Column>
        </Row>
      )

      text = []
      code = []
    }

    text.push(child)
  })

  if (text.length >= 1) {
    children.push(
      <Row>
        <Column>{text}</Column>
        <Column />
      </Row>
    )
  }

  return children
}

export const BlogPost: StatelessComponent<{
  data: any
  location: any
  pageContext: any
  isAmp: boolean
}> = ({ data, location, pageContext, isAmp = false }) => {
  const avatar: string = data.avatar.childImageSharp.fixed.src

  const post = data.mdx
  const {
    title,
    byline,
    excerpt,
    comments,
    manualDate,
    manualCreatedAt,
    sideBySide,
  } = post.frontmatter
  const { previous, next } = pageContext
  const tags = post.frontmatter.tags || []

  const { date, createdAt, modifiedAt } = post.fields

  const footer = (
    <>
      {" "}
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
      {!isAmp && comments ? (
        <Disqus
          identifier={post.id}
          title={title}
          url={`${"https://bennetthardwick.com"}${location.pathname}`}
        />
      ) : (
        ""
      )}
    </>
  )

  return (
    <Layout sideBySide={sideBySide} location={location}>
      {!isAmp && (
        <Helmet>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.2/katex.min.css"
          />
        </Helmet>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": location.url,
            },
            headline: title,
            image: ["https://bennetthardwick.com/og-image.jpg"],
            datePublished: manualCreatedAt || createdAt,
            dateModified: modifiedAt,
            publisher: {
              "@type": "Organization",
              name: "Bennett Hardwick",
              logo: avatar,
            },
            author: {
              "@type": "Person",
              name: "Bennett hardwick",
            },
            description: byline || excerpt,
          }),
        }}
      />

      <SEO title={title} description={byline || excerpt} />

      {sideBySide ? (
        <SizedContainer>
          <h1>{title}</h1>
        </SizedContainer>
      ) : (
        <h1>{title}</h1>
      )}

      <p
        style={{
          ...scale(-1 / 5),
          display: `block`,
          marginBottom: rhythm(1),
        }}
      >
        {manualDate || date}
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
      <MDXRenderer
        components={sideBySide ? { wrapper: SideBySideWrapper } : undefined}
      >
        {post.body}
      </MDXRenderer>
      {sideBySide ? <SizedContainer>{footer}</SizedContainer> : footer}
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

    avatar: file(absolutePath: { regex: "/profile.jpg/" }) {
      childImageSharp {
        fixed(width: 460, height: 460) {
          ...GatsbyImageSharpFixed
        }
      }
    }

    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      body
      fields {
        createdAt
        date: createdAt(formatString: "MMMM DD, YYYY")
        modifiedAt
      }
      frontmatter {
        manualCreatedAt: date
        manualDate: date(formatString: "MMMM DD, YYYY")
        title
        byline
        tags
        comments
        sideBySide
      }
    }
  }
`
