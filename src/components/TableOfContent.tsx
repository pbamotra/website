import React from "react"
import styled from "styled-components"

interface TableOfContentsProps {
  items: { url: string; title: string }[]
}

const Container = styled.div`
  text-align: center;
  border-radius: 3px;
  margin: 0px 20px;
  padding: 0px 20px;
  border: dashed 1px #1ca086;
  margin-bottom: 1rem;
`

const Title = styled.h2`
  margin-top: 24px;
`;
const List = styled.ol``
const Entry = styled.li``

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  return (
    <Container>
      <Title>Table of contents</Title>
      <List>
        {items.map(({ url, title }) => (
          <Entry>
            <a href={url}>{title}</a>
          </Entry>
        ))}
      </List>
    </Container>
  )
}
