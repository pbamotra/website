import React, { StatelessComponent } from "react"
import { Link } from "gatsby"
import { rhythm } from "../utils/typography"
import styled from 'styled-components';
import { Stagger } from "staggered";

export const PostTitle = styled.h3`
  margin-bottom: ${rhythm(1 / 4)}
  && a {
    box-shadow: none;
  }
`;

export const PostPreviewContainer = styled.div``;
export const PostContent = styled.p``;

export const PostPreview: StatelessComponent<{ posts: Post[] }> = ({ posts }) => (
  <>
    {
      posts.map((post, i) => {
        const { title, created, byline } = post.frontmatter;
        const { slug, date } = post.fields;
        const { excerpt } = post;

        return <Stagger key={slug} staggerId={slug + '-' + i}><PostPreviewContainer>
          <PostTitle>
            <Link to={slug || ""}>
              { title }
            </Link>
          </PostTitle>
          <small>{created || date}</small>
          <PostContent dangerouslySetInnerHTML={{
            __html: byline || excerpt
          }} />
        </PostPreviewContainer>
        </Stagger>

      })

    }
  </>
)

export default PostPreview;
