import React, { StatelessComponent } from "react"
import { PostPreviewContainer, PostTitle, PostContent } from "./post-preview";
import { Link } from "@reach/router";
import { Flipped } from "react-flip-toolkit";

export const Projects: StatelessComponent<{ projects: Project[] }> = ({ projects, ...rest }) => (
  <div {...rest}>
    {
      projects.map(({ title, link, byline, date }) =>
        <Flipped key={title} stagger="default" flipId={title}>
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
          </PostPreviewContainer></Flipped>)
    }
  </div>
)

export default Projects;