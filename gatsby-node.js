const path = require(`path`)
const {
  createFilePath
} = require(`gatsby-source-filesystem`)

function paginate(data, pageSize, pageNumber) {
    return data.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
}

function formatNote(note) {
  const name = note.name;
  const id = note.id;
  let title = 'Untitled note';
  let type = 'text';
  let data = {};

  if (note.childMarkdownRemark) {
    type = note.childMarkdownRemark.frontmatter.type || type;
    title = note.childMarkdownRemark.frontmatter.title;
    if (type === 'text') {
      data = {
        html: note.childMarkdownRemark.html,
        preview: note.childMarkdownRemark.excerpt,
        title
      }
    }
  }

  if (note.childNotesYaml) {
    type = note.childNotesYaml.type;
    title = note.childNotesYaml.title;
    if (type === 'flashcards') {
      data = {
        category: note.childNotesYaml.category,
        cards: note.childNotesYaml.cards,
        cardCount: note.childNotesYaml.cards.length
      }
    }
  }

  return {
    name,
    id,
    type,
    data,
    title
  };

}

function generatePreview(note) {
  let newNote = { ...note };

  if (newNote.type === 'text') {
    newNote = {
      ...newNote,
      data: {
        ...newNote.data,
        html: undefined
      }
    }
  }

  if (newNote.type === 'flashcards') {
    newNote = {
      ...newNote,
      data: {
        ...newNote.data,
        cards: undefined
      }
    }
  }

  return newNote;
}

exports.createPages = async ({
  graphql,
  actions
}) => {
  const {
    createPage,
    createRedirect
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
             code {
               body
             }
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

  createRedirect({
    fromPath: '/about',
    toPath: '/',
    statusCode: 302
  });

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
      path: post.fields.slug + 'amp',
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
      path: `/blog/tag/${tag}`,
      component: tagPage,
      context: {
        tag
      }
    })
  })

  const notesResults = await graphql(`
  {
    allFile(filter:{sourceInstanceName:{eq:"notes"}}, sort:{fields:[name], order:DESC}) {
      nodes {
        id
        name
        childMarkdownRemark {
          html
          excerpt(format: HTML, pruneLength: 350)
          frontmatter {
            title
            type
          }
        }
        childNotesYaml{
          title
          type
          category
          cards {
            front
            back
          }
        }
      }
    }
  }`);

  /**
   * NOTES
   */

  const PAGE_SIZE = 50;

  const singleNotePage = path.resolve(`./src/templates/notes/detail-note.tsx`);
  const allNotesPage = path.resolve(`./src/templates/notes/notes-home.tsx`);

  const notes = notesResults.data.allFile.nodes.map(formatNote);

  for (const note of notes) {
    createPage({
      path: `/notes/d/${note.name}`,
      component: singleNotePage,
      context: {
        note
      }
    });

  }

  const pageCount = Math.ceil(notes.length / PAGE_SIZE);

  for (let i = 0; i < pageCount; i++) {
    createPage({
      path: `/notes${i === 0 ? '' : `/${i + 1}`}`,
      component: allNotesPage,
      context: {
        notes: paginate(notes, PAGE_SIZE, i).map(generatePreview),
        currentPage: i + 1,
        pageCount
      }
    })
  }

}

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
    })
    createNodeField({
      name: `slug`,
      node,
      value: '/blog' + value,
    })
  }
}