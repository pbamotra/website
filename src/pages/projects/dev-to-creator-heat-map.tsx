import React, { useState, useMemo, useEffect, FunctionComponent } from "react"
import Layout from "../../components/projects/layout"
import SEO from "../../components/seo"
import styled from "styled-components"

import devData from "../../data/dev-reacts-data.json"

const months = Object.keys(devData)
  .map(Number)
  .sort((a, b) => a - b)

const min = months[0]
const max = months[months.length - 1]

import HeatMap from "react-heatmap-grid"

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 20px;
`
const Title = styled.h1`
  text-align: center;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  > * {
    margin: 4px;
  }
`

const Button = styled.button`
  margin: 4px;
`

const Slider = styled.input`
  flex-grow: 1;
  min-width: 400px;
`

const HeatMapContainer = styled.div`
  font-size: 12px;
`

const buttons = [
  { text: "Average", key: "average" },
  { text: "Median", key: "median" },
  { text: "Total", key: "total" },
  { text: "Frequency", key: "frequency" },
  { text: "Count", key: "count" },
]

const xLabels = new Array(24).fill(0).map((_, i) => `${i}`)
const yLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const Map: FunctionComponent<{ min: number; selected: string }> = ({
  min,
  children,
  selected,
  ...rest
}) => {
  const [actualMin, setActualMin] = useState(min)

  useEffect(() => {
    const timeout = setTimeout(() => setActualMin(min), 100)
    return () => clearTimeout(timeout)
  }, [min])

  const data = useMemo(
    () =>
      new Array(yLabels.length).fill(0).map((_x, day) =>
        new Array(xLabels.length).fill(0).map((_y, hour) => {
          const reacts = []
          months
            .filter(x => x > actualMin)
            .forEach(x => {
              ;(
                (devData[String(x)][String(day)] || {})[String(hour)] || []
              ).forEach(y => {
                reacts.push(y)
              })
            })

          if (selected === "count") {
            return reacts.length
          }

          const sum = reacts.reduce((acc, a) => acc + a, 0) || 0

          let ret

          if (selected === "average") {
            ret = Math.round(sum / reacts.length)
          } else if (selected === "median" || selected === "frequency") {
            const map = {}
            reacts
              .map(x => Math.round(x / 5) * 5)
              .forEach(x => {
                map[String(x)] = (map[String(x)] || 0) + 1
              })

            const keys = Object.keys(map).sort((a, b) => map[a] - map[b])

            ret =
              selected === "median"
                ? keys[Math.round(keys.length / 2)]
                : keys[keys.length - 1]
          } else {
            ret = sum
          }

          return ret || 0
        })
      ),
    [actualMin, selected]
  )

  return (
    <>
      Since month {actualMin}, measure: {selected}
      <HeatMap data={data} xLabels={xLabels} yLabels={yLabels} />
    </>
  )
}

export const Template = ({ children, location, ...props }) => {
  const [selected, setSelected] = useState<string>("total")

  const [currentMin, setMin] = useState(Math.round((max - min) / 2))

  const selectFactory = s => () => setSelected(s)

  const sliderChanged: React.ChangeEventHandler<HTMLInputElement> = e =>
    setMin(Number(e.target.value))

  const title = "Dev.to Post Heat Map"

  return (
    <Layout location={location} {...props}>
      <SEO
        title={title}
        keywords={["TwoSet Violin", "Brett Yang", "Eddy Chen", "YouTube"]}
      />
      <Container>
        <Title>{title || ""}</Title>
        <ButtonContainer>
          {buttons.map(({ text, key }) => (
            <Button key={key} onClick={selectFactory(key)}>
              {text}
            </Button>
          ))}
          <Slider
            type="range"
            min={min}
            max={max - 1}
            onChange={sliderChanged}
            value={currentMin}
          />
        </ButtonContainer>
        <HeatMapContainer>
          <Map selected={selected} min={currentMin} />
        </HeatMapContainer>
      </Container>
    </Layout>
  )
}

export default Template
