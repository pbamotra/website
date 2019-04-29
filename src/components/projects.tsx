import React, { StatelessComponent } from "react"
import { PostPreviewContainer, PostTitle, PostContent } from "./post-preview";
import { Link } from "@reach/router";
import { Flipped } from "react-flip-toolkit";
import { Stagger } from "staggered";

export const Projects: StatelessComponent<{ projects: Project[] }> = ({ projects, ...rest }) => (
  <div {...rest}>
    {
      projects.map(({ title, link, byline, date }) =>
        <Stagger key={title} staggerId={title}>
          <PostPreviewContainer>
            <PostTitle>
              <Link to={link}>
                {title}
              </Link>
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