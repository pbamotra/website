import React, {StatelessComponent} from "react"
import {PostPreviewContainer, PostTitle, PostContent} from "./post-preview";

export const Projects: StatelessComponent<{projects: Project[]}> = ({projects, ...rest}) => (
  <div {...rest}>
    {
      projects.map(({title, link, byline, date}) =>
        <PostPreviewContainer>
          <PostTitle>
            <a href={link}>
              {title}
            </a>
          </PostTitle>
          <small>{date}</small>
          <PostContent dangerouslySetInnerHTML={{
            __html: byline
          }} />
        </PostPreviewContainer>)
    }
  </div>
)

export default Projects;
