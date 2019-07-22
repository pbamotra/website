import React, {StatelessComponent, useState} from "react"
import styled, {css} from "styled-components"
import Layout from "../../components/layout"
import {NotesGrid} from "../../components/notes/note-grid"
import {SEO} from "../../components/seo"
import {rhythm} from "../../utils/typography"
import {BaseNote} from "../../components/notes/note-types/module"

const OriginalWidth = css`
  max-width: calc(${rhythm(24)} - calc(${rhythm(3 / 4)} * 2));
  margin: auto;
`

const NotesLayout = styled(Layout)`
  @media (min-width: 778px) {
    max-width: 1385px;

    > nav {
      ${OriginalWidth}
    }
    > footer {
      ${OriginalWidth}
    }
    > main {
      width: 100%;
      > header {
        ${OriginalWidth}
      }
    }
  }

  margin: auto;
  max-width: calc(${484}px + calc(${rhythm(3 / 4)} * 2));
`

export const Notes: StatelessComponent<{
  location: any
  pageContext: {notes: BaseNote<any>[], max: number, current: number}
}> = ({location, pageContext: {notes}}) => {

  const [notesList] = useState(notes);

  return (
    <NotesLayout location={location}>
      <SEO
        title="Notes"
        keywords={[
          `blog`,
          `javascript`,
          `typescript`,
          `programming`,
          "bennetthardwick",
        ]}
      />

      <header>
        <h1>Notes</h1>
        <p>Some stuff I done learned. Click on a note to read more.</p>
      </header>
      <NotesGrid notesList={notesList} />
    </NotesLayout>
  )
}

export default Notes;
