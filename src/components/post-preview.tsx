import React, { StatelessComponent } from "react"
import { Link } from "gatsby"
import { rhythm } from "../utils/typography"
import styled from 'styled-components';
import { node } from "prop-types";

export const PostTitle = styled.h3`
  margin-bottom: ${rhythm(1 / 4)}
  ${Link} {
    box-shadow: none;
  }
`;

export const PostPreviewContainer = styled.div``;
export const PostContent = styled.p``;

export const PostPreview: StatelessComponent<{ posts: Post[] }> = ({ posts }) => (
  <>
    {
      posts.map(post => {
        const { title, date, byline } = post.frontmatter;
        const { slug } = post.fields;
        const { excerpt } = post;

        return <PostPreviewContainer key={slug}>
          <PostTitle>
            <Link to={slug}>
              { title }
            </Link>
          </PostTitle>
          <small>{date}</small>
          <PostContent dangerouslySetInnerHTML={{
            __html: byline || excerpt
          }} />
        </PostPreviewContainer>

      })

    }
  </>
)

export default PostPreview;