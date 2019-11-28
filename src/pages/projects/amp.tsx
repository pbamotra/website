import React from "react"
import Layout from "../../components/layout"
import SEO from "../../components/seo"
import styled from "styled-components"
import { rhythm } from "../../utils/typography"
import { Link } from "gatsby"

const Title = styled.h3`
  margin-bottom: ${rhythm(1 / 4)} && a {
    box-shadow: none;
  }
`

const HEATMAP = (
  <div>
    <Title>
      <Link to={"/projects/dev-to-creator-heat-map/"}>
        Dev.to Creator Heat Map
      </Link>
    </Title>
    <small>May 24, 2019</small>
    <p>
      A quick little heat map created based on how often people upload / get
      reactions on{" "}
      <a href="https://dev.to" target="__blank">
        dev.to
      </a>
      .
    </p>
  </div>
)

const BRETT_AND_EDDY = (
  <div>
    <Title>
      <Link to={"/projects/brett-and-eddy-react/"}>Brett and Eddy React</Link>
    </Title>
    <small>April 16, 2019</small>
    <p>
      A small app that lets you put in a youtube link and have Brett and Eddy
      from{" "}
      <a
        href="https://www.youtube.com/channel/UCAzKFALPuF_EPe-AEI0WFFw"
        target="__blank"
      >
        TwoSetViolin
      </a>{" "}
      react to it.
    </p>
  </div>
)

const STAGGERED = (
  <div>
    <Title>
      <Link to={"/projects/staggered-library/"}>Staggered</Link>
    </Title>
    <small>July 9, 2019</small>
    <p>
      An hilariously simple and inefficient React library for staggering in
      elements in a React app.
    </p>
  </div>
)

const DOTFILES = (
  <div>
    <Title>
      <a href="https://github.com/bennetthardwick/dotfiles" target="__blank">
        Dotfiles
      </a>
    </Title>
    <small>Always...</small>
    <p>
      An ongoing attempt to make myself ultra-productive and the very best, like
      no one ever was.
    </p>
  </div>
)

const DARKNET = (
  <div>
    <Title>
      <a href="https://github.com/bennetthardwick/darknet.js" target="__blank">
        Darknet.js
      </a>
    </Title>
    <small>May 28, 2018</small>
    <p>
      A Node.js wrapper of{" "}
      <a href="https://pjreddie.com/" target="__blank">
        pjreddie's
      </a>{" "}
      open source neural network framework Darknet. It's created using Node.js
      C++ extensions.
    </p>
  </div>
)

const GRUVBOX_GTK = (
  <div>
    <Title>
      <a href="https://github.com/bennetthardwick/gruvbox-gtk" target="__blank">
        Gruvbox GTK
      </a>
    </Title>
    <small>April 3, 2018</small>
    <p>
      A simple GTK theme based on{" "}
      <a href="https://github.com/horst3180/arc-theme" target="__blank">
        Arc
      </a>
      , but with the Gruvbox colours.
    </p>
  </div>
)

export const ProjectsIndex: React.FC<{ data: any; location: any }> = ({
  location,
}) => {
  return (
    <Layout location={location}>
      <SEO
        title="Projects"
        keywords={["projects", "rust", "tech", "programming"]}
      />
      <h1>Projects</h1>
      <p>A few small projects I've enjoyed working on over the years.</p>
      {DARKNET}
      {GRUVBOX_GTK}
      {DOTFILES}
      {BRETT_AND_EDDY}
      {HEATMAP}
      {STAGGERED}
    </Layout>
  )
}

export default ProjectsIndex
