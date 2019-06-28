import React, { StatelessComponent } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { PostPreview } from "../components/post-preview"
import About from "../components/about"
import Projects from "../components/projects"
import { Stagger, StaggerWrapper } from "staggered";
import {AudioPlayer} from '../components/audio/audio';

export const Home: StatelessComponent<{ data: any, location: any }> = ({ data, location }) => {
  const posts = data.allMdx.edges.map(x => x.node) as Post[];
  const projects = data.allProjectsYaml.edges.map(x => x.node) as Project[];
  return (
    <Layout location={location}>
      <SEO
        title="Projects"
        keywords={[`projects`, `gatsby`, `javascript`, `react`]}
      />

      <StaggerWrapper>

        <AudioPlayer title="hey hey hey hey hey hey" link={'https://a.tumblr.com/tumblr_oysqtmKi6y1wegcseo1.mp3?plead=please-dont-download-this-or-our-lawyers-wont-let-us-host-audio'} />

        <Stagger staggerId="about-section-wow" >
          <About />
        </Stagger>


        <Stagger staggerId="project" >
        <h2>Projects</h2>
        </Stagger>

        <Projects projects={projects} />

        <Stagger staggerId="posts-to-flip" >
        <h2>Recent Posts</h2>
        </Stagger>

        <PostPreview posts={posts.slice(0, 3)} />

      </StaggerWrapper>
    </Layout>
  )
}

export default Home;

export const pageQuery = graphql`
  query {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true } } fileAbsolutePath: { regex: "^\/blog\/" } }
      limit: 1000
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            byline
          }
        }
      }
    }
    allProjectsYaml {
      edges {
        node {
          title
          byline
          date
          link
        }
      }
    }
  }
`
