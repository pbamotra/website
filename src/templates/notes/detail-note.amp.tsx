import React, { StatelessComponent } from "react"
import Layout from "../../components/layout"
import SEO from "../../components/seo"
import {
  NOTE_TYPE_MAP,
  BaseNote,
} from "../../components/notes/note-types/module"
import { Link } from "gatsby"
import Bio from '../../components/bio';

const Template: StatelessComponent<{
  location: any
  pageContext: { note: BaseNote<any> }
}> = ({ location, pageContext: { note } }) => {
  const Detailed = NOTE_TYPE_MAP[note.type].detail
  const Note = props => <Detailed {...props} {...note} />

  return (
    <Layout location={location}>
      <SEO
        title={"Notes: " + note.title}
        keywords={[
          `notes`,
          `javascript`,
          `typescript`,
          `programming`,
          "bennetthardwick",
        ]}
      />
      <header>
        <h1>{note.title}</h1>
        <p>
          This is a note titled "{note.name}" taken from my note Library.{" "}
          <Link to={"/notes/"}>Return to Library.</Link>
        </p>
      </header>
      <Note modal={false} />
      <Bio isAmp={true} />
    </Layout>
  )
}

export default Template
