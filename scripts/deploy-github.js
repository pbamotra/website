const ghpages = require('gh-pages')

// replace with your repo url
ghpages.publish(
  'public',
  {
    branch: 'master',
    repo: 'https://github.com/bennetthardwick/bennetthardwick.github.io',
  },
  () => {
    console.log('Deploy Complete!')
  }
)
