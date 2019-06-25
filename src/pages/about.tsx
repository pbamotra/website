import React, {StatelessComponent} from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import A from '../components/about';
import {Stagger, StaggerWrapper} from "staggered";
import Bio from '../components/bio';

export const About: StatelessComponent<{location: any}> = ({location}) => (
  <Layout location={location}>
    <SEO
      title="About"
      keywords={[`about`, `bennett`, `hardwick`, `software engineer`, `developer`]}
    />
    <StaggerWrapper>

      <Stagger staggerId="about-title" >
        <h1>About</h1>
      </Stagger>


      <Stagger staggerId="about-me">
        <A />
      </Stagger>

      <br />

      <Stagger staggerId="more-about">
        <p>
          I grew up on a sugar cane farm in rural north Queensland Australia, and ever since I can remember I've enjoyed building things.
        </p>
        <p>
          In Grade 5 I was introduced to the world of programming through Scratch and Lego Mindstorms.
          It took me a while to pick up, but after spending countless lunch-times inside the classroom, I got it to stick.
        </p>
        <p>
          If only my 10 year old self could see me now - spending hours working on silly bugs, procrastinating by editing dotfiles and ricing Linux, and not letting my colleagues catch a breath before I tell them about my new favourite Vim trick - I'm sure he'd be proud.
        </p>
      </Stagger>

      <Stagger staggerId="about-me-skills">
        <h3>Stuff I Work With</h3>

        <ul>
          <li>Visible Web Stuff (React, Angular, Vue)</li>
          <li>Hidden Web Stuff (Express) </li>
          <li>Gatsby</li>
          <li><i><b>Vim</b></i></li>
          <li>Linux</li>
        </ul>

        <h3>Languages I Like</h3>

        <ul>
          <li>Javascript and Typescript</li>
          <li>C</li>
          <li>Rust</li>
          <li>Haskell</li>
          <li>Japanese</li>
        </ul>

        <h3></h3>
      </Stagger>

      <Bio />

    </StaggerWrapper>
  </Layout>
);

export default About;
