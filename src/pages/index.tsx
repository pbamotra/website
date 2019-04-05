import React, { StatelessComponent, useState, useEffect } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { PostPreview } from "../components/post-preview"
import About from "../components/about"
import Projects from "../components/projects"
import { Flipped, Flipper } from "react-flip-toolkit";
import { StaggerAnimationContainer } from "../components/stagger-wrapper";

export const Home: StatelessComponent<{ data: any, location: any }> = ({ data, location }) => {
  const posts = data.allMarkdownRemark.edges.map(x => x.node) as Post[];
  const projects = data.allProjectsYaml.edges.map(x => x.node) as Project[];

  const [stateVisible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, [false])

  const isVisible = window === undefined ? true : stateVisible

  return (
    <Layout location={location}>
      <SEO
        title="Projects"
        keywords={[`projects`, `gatsby`, `javascript`, `react`]}
      />

      <Flipper flipKey={isVisible} staggerConfig={{ default: { speed: .1 }}}>
      <StaggerAnimationContainer visible={isVisible}>

        <Flipped stagger="default" flipId="about-section-wow" >
          <About />
        </Flipped>

        <Flipped stagger="default" flipId="project" >
        <h2>Projects</h2>
        </Flipped>

        <Projects projects={projects} />

        <Flipped stagger="default" flipId="posts-to-flip" >
        <h2>Recent Posts</h2>
        </Flipped>

        <PostPreview posts={posts.slice(0, 3)} />

      </StaggerAnimationContainer>
      </Flipper>
    </Layout>
  )
}

export default Home;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true } } }
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
