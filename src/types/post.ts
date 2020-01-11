interface Post {
  frontmatter: {
    title: string
    byline: string
    created?: string
    tags?: string[]
    comments?: boolean
  }
  excerpt: string
  timeToRead: number
  wordCount: {
    words: number
  }
  fields: {
    slug?: string
    date: string
  }
}
