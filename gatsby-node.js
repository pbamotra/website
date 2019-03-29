const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.tsx`)
  const tagPage = path.resolve(`./src/templates/tag-page.tsx`)

  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: { frontmatter: { draft: { ne: true } } }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                tags
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    createRedirect({
      fromPath: '/about',
      toPath: '/',
      statusCode: 302
    });

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges
    const tags = new Set(posts.reduce((acc, post) => acc.concat(post.node.frontmatter.tags || []), []))

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    tags.forEach(tag => {
      createPage({
        path: `/blog/tag/${tag}`,
        component: tagPage,
        context: {
          tag
        }
      })
    })

  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value: '/blog' + value,
    })
  }
}
