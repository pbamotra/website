import React, {StatelessComponent} from "react"
import {graphql} from "gatsby"
import Helmet from 'react-helmet';
import {BlogPost as Blog} from './blog-post';

const BlogPost: StatelessComponent<{
  data: any
  location: any
  pageContext: any
}> = props => {
  return <>
    <Helmet>
      <style>{`amp-anim img { object-fit: contain; }`}</style>
    </Helmet>
    <Blog {...props} isAmp={true} />
  </>
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
        createdAt,
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
      }
    }
  }
`
