import React, { StatelessComponent } from "react"
import { PostPreviewContainer, PostTitle, PostContent } from "./post-preview";
import { Link } from "@reach/router";

export const Projects: StatelessComponent<{ projects: Project[] }> = ({ projects }) => (
  <>
    {
      projects.map(({ title, link, byline, date }) =>
        <PostPreviewContainer key={title}>
          <PostTitle>
            <Link to={link}>
              {title}
            </Link>
          </PostTitle>
          <small>{date}</small>
          <PostContent dangerouslySetInnerHTML={{
            __html: byline
          }} />
        </PostPreviewContainer>)
    }
  </>
)

export default Projects;