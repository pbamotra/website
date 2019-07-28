const GTAG_ID = 'UA-111574706-1';

module.exports = {
  siteMetadata: {
    title: `Bennett`,
    author: `Bennett Hardwick`,
    social: {
      twitter: 'bennettbackward'
    },
    description: `The personal website and thoughts of me - Bennett Hardwick.`,
    siteUrl: `https://bennetthardwick.com`
  },
  plugins: [{
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/content/blog`,
      name: `blog`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/content/assets`,
      name: `assets`,
    },
  },
  `gatsby-transformer-sharp`,
  {
    resolve: `gatsby-plugin-sharp`,
    options: {
      defaultQuality: 100,
      jpegProgressive: false
    },
  },
  `gatsby-transformer-yaml`,
  `gatsby-transformer-remark`,
  `gatsby-plugin-netlify`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `data`,
      path: `./content/data/`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `./content/notes/`,
      name: `notes`
    },
  },
  {
    resolve: `gatsby-plugin-mdx`,
    options: {
      extensions: ['.mdx'],
      gatsbyRemarkPlugins: [{
        resolve: 'gatsby-remark-images',
        options: {
          maxWidth: 655
        },
      },
      {
        resolve: `gatsby-remark-katex`,
        options: {
          // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
          strict: `ignore`
        }
      },
      {
        resolve: `gatsby-remark-prismjs`,
        options: {
          classPrefix: 'language-',
          inlineCodeMarker: null,
          aliases: {},
        },
      },
        `gatsby-remark-copy-linked-files`,
        `gatsby-remark-smartypants`,
      ],
    },
  },
  {
    resolve: `gatsby-plugin-gtag`,
    options: {
      trackingId: GTAG_ID,
      anonymize: true,
    },
  },
  {
    resolve: `gatsby-plugin-amp`,
    options: {
      analytics: {
        type: 'gtag',
        dataCredentials: 'include',
        config: {
          vars: {
            gtag_id: GTAG_ID,
            config: {
              [GTAG_ID]: {
                page_location: '{{pathname}}'
              },
            },
          },
        },
      },
      canonicalBaseUrl: 'https://bennetthardwick.com/',
      components: ['amp-form'],
      excludePaths: [ '/', '/notes/', '/blog/', '/about/' ],
      pathIdentifier: '/amp/',
      relAmpHtmlPattern: '{{canonicalBaseUrl}}{{pathname}}{{pathIdentifier}}',
      useAmpClientIdApi: true,
    },
  },

  {
    resolve: `gatsby-plugin-feed`,
    options: {
      query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
      feeds: [{
        serialize: ({
          query: {
            site,
            allMdx
          }
        }) => {
          return allMdx.edges.map(edge => {
            return Object.assign({}, edge.node.frontmatter, {
              description: edge.node.excerpt,
              date: edge.node.frontmatter.date,
              url: site.siteMetadata.siteUrl + edge.node.fields.slug,
              guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
              custom_elements: [{
                "content:encoded": edge.node.html
              }],
            })
          })
        },
        query: `
              {
                allMdx(
                  sort: { fields: [frontmatter___date], order: DESC }
                  filter: { frontmatter: { draft: { ne: true } } fileAbsolutePath: { regex: "^\/blog\/" } }
                ) {
                  edges {
                    node {
                      excerpt
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
        output: "/rss.xml",
        title: "Bennett Hardwick's Blog",
      },],
    },
  },

  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [{
        resolve: `gatsby-remark-images`,
        options: {
          maxWidth: 440,
        },
      },
      {
        resolve: `gatsby-remark-katex`,
        options: {
          // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
          strict: `ignore`
        }
      },
      {
        resolve: `gatsby-remark-responsive-iframe`,
        options: {
          wrapperStyle: `margin-bottom: 1.0725rem`,
        },
      },
        `gatsby-remark-prismjs`,
        `gatsby-remark-copy-linked-files`,
        `gatsby-remark-smartypants`,
      ],
    },
  },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-typescript`,
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `Bennett Hardwick`,
      short_name: `Bennett`,
      start_url: `/`,
      background_color: `#ffffff`,
      theme_color: `#1ca086`,
      display: `standalone`,
      icon: `content/assets/profile.jpg`,
    },
  },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
  {
    resolve: `gatsby-plugin-typography`,
    options: {
      pathToConfigModule: `src/utils/typography`,
      omitGoogleFont: true
    },
  },
  {
    resolve: `gatsby-plugin-disqus`,
    options: {
      shortname: `bennetthardwick`
    }
  },
    'gatsby-plugin-sitemap',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-meta-redirect'
  ],
}
