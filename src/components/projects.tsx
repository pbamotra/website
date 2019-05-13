import React, { StatelessComponent } from "react"
import { PostPreviewContainer, PostTitle, PostContent } from "./post-preview";
import { Stagger } from "staggered";

export const Projects: StatelessComponent<{ projects: Project[] }> = ({ projects, ...rest }) => (
  <div {...rest}>
    {
      projects.map(({ title, link, byline, date }) =>
        <Stagger key={title} staggerId={title}>
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
          </PostPreviewContainer></Stagger>)
    }
  </div>
)

export default Projects;