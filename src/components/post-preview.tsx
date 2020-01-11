import React, { StatelessComponent } from "react"
import { Link } from "gatsby"
import { rhythm } from "../utils/typography"
import styled from "styled-components"

export const PostTitle = styled.h3`
  margin-bottom: ${rhythm(1 / 4)} && a {
    box-shadow: none;
  }
`

const Info = styled.small`
  opacity: 0.8;
  margin-bottom: 0.1rem;
  display: block;
`

const Highlighted = styled.span`
  color: #1ca086;
`

export const PostPreviewContainer = styled.div``
export const PostContent = styled.p``

export const PostPreview: StatelessComponent<{ posts: Post[] }> = ({
  posts,
}) => (
  <>
    {posts.map((post, i) => {
      const { title, created } = post.frontmatter
      const { slug, date } = post.fields
      const {
        excerpt,
        wordCount: { words },
        timeToRead,
      } = post

      return (
        <PostPreviewContainer key={"blog-" + i}>
          <PostTitle>
            <Link to={slug || ""}>{title}</Link>
          </PostTitle>
          <Info>
            {created || date} - <Highlighted>{words}</Highlighted> words -{" "}
            <Highlighted>{timeToRead}</Highlighted> minute
            {timeToRead > 1 ? "s" : ""}
          </Info>
          {excerpt.split("\n").map(x => (
            <PostContent key={x}>{x}</PostContent>
          ))}
        </PostPreviewContainer>
      )
    })}
  </>
)

export default PostPreview
