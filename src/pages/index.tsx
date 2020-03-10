import React, { StatelessComponent } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import About from "../components/about"
import GatsbyImage from "gatsby-image"
import { Links as L } from "../components/links"
import styled, { keyframes } from "styled-components"

const ProfileFrames = keyframes`
  0% {
    clip-path: polygon(5% 3%,96% 3%,97% 93%,11% 96%);
  }
  25% {
    clip-path: polygon(9% 4%, 99% 1%, 95% 97%, 7% 93%);
  }
  75% {
    clip-path: polygon(5% 6%, 93% 2%, 94% 94%, 13% 96%);
  }
  100% {
    clip-path: polygon(5% 3%,96% 3%,97% 93%,11% 96%);
  }
`

const FrontFrames = keyframes`
  0% {
    clip-path: polygon(3% 2%, 98% 2%, 95% 92%, 9% 92%);
  }
  25% {
    clip-path: polygon(5% 3%,96% 1%,97% 93%,11% 96%);
  }
  75% {
    clip-path: polygon(9% 4%, 99% 1%, 95% 97%, 7% 93%);
  }
  100% {
    clip-path: polygon(3% 2%, 98% 2%, 95% 92%, 9% 92%);
  }
`
const BackFrames = keyframes`
  0% {
    clip-path: polygon(7% 0, 100% 4%, 92% 93%, 7% 90%);
  }
  25% {
    clip-path: polygon(3% 2%, 98% 2%, 95% 92%, 9% 92%);
  }
  75% {
    clip-path: polygon(5% 3%,96% 1%,97% 93%,11% 96%);
  }
  100% {
    clip-path: polygon(7% 0, 100% 4%, 92% 93%, 7% 90%);
  }
`

export const ProfileContainer = styled.div`
  @media (max-width: 700px) {
    display: none;
  }

  position: relative;

  > div {
    animation: ${ProfileFrames} infinite 10s;
  }

  :after,
  :before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #1ca086;
    z-index: -1;
  }

  :after {
    animation: ${FrontFrames} infinite 10s;
    opacity: 0.5;
  }

  :before {
    animation: ${BackFrames} infinite 10s;
    opacity: 0.25;
  }
`

const Links = styled(L)`
  @media (max-width: 700px) {
    display: none;
  }
`

const BlogCta = styled.p`
  text-align: center;
  font-size: 14pt;
`;

export const Home: StatelessComponent<{ data: any; location: any }> = ({
  data,
  location,
}) => {
  const {
    frontmatter: { title },
    fields: { slug },
  } = data.allMdx.nodes[0]

  return (
    <Layout location={location}>
      <SEO
        title="Hello!"
        keywords={[`gatsby`, `javascript`, `react`, `clipchamp`]}
      />
      <ProfileContainer>
        <GatsbyImage fixed={data.sideImage.childImageSharp.fixed} />
      </ProfileContainer>
      <div>
        <About />
        <BlogCta>
          Read my latest post "<Link to={slug}>{title}</Link>"
        </BlogCta>
        <Links />
      </div>
    </Layout>
  )
}

export default Home

export const pageQuery = graphql`
  query {
    sideImage: file(absolutePath: { regex: "/bennett.jpg/" }) {
      childImageSharp {
        fixed(width: 280, quality: 100) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    allMdx(
      sort: { fields: [fields___sortTime], order: DESC }
      filter: {
        frontmatter: { draft: { ne: true } }
        fileAbsolutePath: { regex: "^/blog/" }
      }
      limit: 1
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
        }
      }
    }
  }
`
