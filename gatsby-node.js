const path = require(`path`)
const {
  createFilePath
} = require(`gatsby-source-filesystem`)

function paginate(data, pageSize, pageNumber) {
  return data.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
}

exports.createPages = async ({
  graphql,
  actions
}) => {
  const {
    createPage
  } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.tsx`)
  const blogPostAmp = path.resolve(`./src/templates/blog-post.amp.tsx`)
  const tagPage = path.resolve(`./src/templates/tag-page.tsx`)

  let result = await graphql(
    `
      {

	      allFile {
         nodes {
          sourceInstanceName
          id
           childMdx {
             id
             body
             frontmatter {
               title
             }
           }
         }
        }

        allMdx(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: { frontmatter: { draft: { ne: true } } }
          limit: 1000
        ) {
          nodes {
              id
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
    `
  );
  if (result.errors) {
    throw result.errors
  }

  const postIds = new Set(result.data.allFile.nodes.filter(x => x.sourceInstanceName === 'blog' && x.childMdx).map(x => x.childMdx.id));

  // Create blog posts pages.
  const posts = result.data.allMdx.nodes.filter(x => postIds.has(x.id));
  const tags = new Set(posts.reduce((acc, post) => acc.concat(post.frontmatter.tags || []), []))

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.fields.slug,
      component: blogPost,
      context: {
        slug: post.fields.slug,
        previous,
        next,
      },
    })

    createPage({
      path: post.fields.slug + 'amp/',
      component: blogPostAmp,
      context: {
        slug: post.fields.slug,
        previous,
        next,
      },
    })

  })

  tags.forEach(tag => {
    createPage({
      path: `/blog/tag/${tag}/`,
      component: tagPage,
      context: {
        tag
      }
    })
  })

}

const FileReg = /^[0-9]{4}-[0-9]{2}-[0-9]{2}-/;

const formatDate = d => (new Date(d).toISOString().substr(0, 10));

const formatFileName = (val, d) => formatDate(d) + '-' + (
  FileReg.test(val)
    ? val.substr(11)
    : val
);

const { execSync } = require('child_process');

exports.onCreateNode = ({
  node,
  actions,
  getNode
}) => {
  const {
    createNodeField
  } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({
      node,
      getNode
    });

    const fileNode = getNode(node.parent);

    const created = new Date(new String(execSync(`git log --follow --format="%ad" -- ${fileNode.absolutePath} | tail -1`)));
    const modified = new Date(new String(execSync(`git log -1 --follow  --format="%ad" -- ${fileNode.absolutePath} | cat`)));
    
    createNodeField({
      name: `slug`,
      node,
      value: '/blog/' + formatFileName(value.substr(1), node.frontmatter.date || created),
    })

    createNodeField({
      node,
      name: 'modifiedAt',
      value: modified
    });

    createNodeField({
      node,
      name: 'createdAt',
      value: created
    });

    createNodeField({
      node,
      name: 'sortTime',
      value: node.frontmatter.date || created
    });

    createNodeField({
      node,
      name: 'draft',
      value: value.startsWith('/draft')
    });



  }
}
