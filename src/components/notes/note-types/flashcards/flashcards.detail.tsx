import React, { FunctionComponent, useState, useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import { BaseNote } from "../module"
import styled from "styled-components"
import { Link } from "gatsby"
import Flippy, { FrontSide, BackSide } from "react-flippy"
import { DETAIL_NOTE_SIZE } from "../../note"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRandom, faStepBackward } from "@fortawesome/free-solid-svg-icons"
import { Furigana } from "../../../../components/furigana";

type Data = {
  title: string
  category: string
  cards: { front: string; back: string }[]
}

const DetailedTitle = styled.h2`
  margin-top: 0.75rem;
  margin-right: 1rem;
  text-align: center;
`

type FlashCardFunction = FunctionComponent<BaseNote<Data> & { modal?: boolean }>

const FlashCardContainer = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 24px;
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;

  > * {
    width: 100%;
  }
`

const HiddenFlashCardContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  visibility: hidden;
  pointer-events: none;
  ${DETAIL_NOTE_SIZE}

  ${FlashCardContainer} {
    display: block;
  }
`

const FlashCard = styled.div<{ height?: number }>`
  padding: 12px 20px;
  width: 100%;
  display: flex;
  line-height: 1;
  flex-direction: column;
  box-sizing: border-box;
  height: ${({ height }) => (height ? height + "px" : "fit-content")};
`

const FlashCardContent = styled.div<{ length?: number }>`
  padding: 4px;
  display: flex;
  flex-align: center;
  flex-grow: 1;
  align-items: center;
  text-align: center;
  justify-content: center;
  ${({ length }) => {
    if (length && length <= 12) {
      return "font-size: 42px"
    }
    return ""
  }}
`

const FlashCardTitle = styled.h4`
  text-align: center;
  margin-top: 0px;
  margin-bottom: 24px;
  opacity: 0.6;
  color: #1ca086;
`

const CategoryTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 2rem;
  strong {
    color: #1ca086;
  }
`

const ModalCategoryTitle = styled(CategoryTitle)`
  font-size: 16px;
  margin-bottom: 0;
  margin-top: 16px;
  opacity: 0.9;
`

const Button = styled.button`
  opacity: 0.45;
  cursor: pointer;
  padding: 4px;
  transition: opacity 0.3s;
  background: none;
  border: none;
  outline: none;
  :hover {
    opacity: 1;
  }
`

const HIDDEN_FLASH_KEY = "flashcard-hidden"

const ModalLayout: FlashCardFunction = ({ data, title }) => {
  const [frontIndex, setFrontIndex] = useState(0)
  const [backIndex, setBackIndex] = useState(0)
  const [frontShowing, setFrontShowing] = useState(true)
  const [isFlipped, setIsFlipped] = useState(false)

  const flipTimerState = useRef({ flipTimer: undefined })

  const [cards, setCards] = useState(
    data.cards.map((x, i) => ({ ...x, key: i + "--card" }))
  )
  const [height, setHeight] = useState(0)

  function flipComplete() {
    const { flipTimer } = flipTimerState.current

    setIsFlipped(!isFlipped)

    if (flipTimer) {
      clearTimeout(flipTimer)
      flipTimerState.current.flipTimer = undefined
      return
    } else {
      flipTimerState.current.flipTimer = setTimeout(() => {
        if (!frontShowing) {
          setFrontShowing(true)
          setBackIndex((backIndex + 1) % cards.length)
        } else {
          setFrontShowing(false)
          setFrontIndex((frontIndex + 1) % cards.length)
        }
        flipTimerState.current.flipTimer = undefined
      }, 600)
    }
  }

  const CardsToMeasure: FunctionComponent = props => (
    <HiddenFlashCardContainer {...props}>
      <FlashCardContainer>
        {cards
          .reduce(
            (acc, a) =>
              acc.concat([
                {
                  key: a.key + "--front",
                  content: a.front,
                },
                {
                  key: a.key + "--back",
                  content: a.back,
                },
              ]),
            []
          )
          .map(({ content, key }) => (
            <FlashCard className={HIDDEN_FLASH_KEY} key={key}>
              <Flippy>
                <FrontSide>
                  <FlashCardTitle>Back</FlashCardTitle>
                  <FlashCardContent length={content.length}>
                    {content}
                  </FlashCardContent>
                </FrontSide>
              </Flippy>
            </FlashCard>
          ))}
      </FlashCardContainer>
    </HiddenFlashCardContainer>
  )

  useEffect(() => {
    if (height <= 0) {
      const container = document.createElement("div")
      document.body.appendChild(container)

      ReactDOM.render(<CardsToMeasure />, container, () => {
        setTimeout(() => {
          setHeight(
            Array.from(container.querySelectorAll("." + HIDDEN_FLASH_KEY))
              .map(x => {
                return x.getBoundingClientRect().height
              })
              .reduce((acc, a) => Math.max(acc, a), 0)
          )
          container.remove()
        }, 2)
      })
    }
  }, [false])

  function backToStart(e: React.MouseEvent) {
    setBackIndex(0)
    setFrontIndex(0)
    setIsFlipped(false)
    setFrontShowing(true)
    e.stopPropagation()
    e.preventDefault()
  }

  function shuffle(e: React.MouseEvent) {
    const newCards = cards.slice()

    var currentIndex = newCards.length,
      temporaryValue,
      randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = newCards[currentIndex]
      newCards[currentIndex] = newCards[randomIndex]
      newCards[randomIndex] = temporaryValue
    }

    setCards(newCards)
    backToStart(e)
  }

  return (
    <>
      <DetailedTitle>{title}</DetailedTitle>
      <ModalCategoryTitle as={"p"}>
        <strong>{data.cards.length}</strong> flascards in the{" "}
        <strong>{data.category}</strong> category. <br /> Click the cards to see
        answers!
      </ModalCategoryTitle>
      <Button onClick={backToStart}>
        <FontAwesomeIcon icon={faStepBackward} />
      </Button>{" "}
      &nbsp;{" "}
      <Button onClick={shuffle}>
        <FontAwesomeIcon icon={faRandom} />
      </Button>
      <FlashCardContainer>
        <Flippy isFlipped={isFlipped} style={{ cursor: "pointer" }}>
          <FrontSide>
            <FlashCard onClick={flipComplete} height={height}>
              <FlashCardTitle>Front</FlashCardTitle>
              <FlashCardContent length={cards[frontIndex].front.length}>
                {data.category === 'japanese' ? <Furigana>{cards[frontIndex].front}</Furigana> : cards[frontIndex].front}
              </FlashCardContent>
            </FlashCard>
          </FrontSide>
          <BackSide>
            <FlashCard onClick={flipComplete} height={height}>
              <FlashCardTitle>Back</FlashCardTitle>
              <FlashCardContent length={cards[backIndex].back.length}>
                {data.category === 'japanese' ? <Furigana>{cards[backIndex].back}</Furigana> : cards[backIndex].back}
              </FlashCardContent>
            </FlashCard>
          </BackSide>
        </Flippy>
      </FlashCardContainer>
    </>
  )
}

const CardList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

const CardEntry = styled.li`
  padding: 24px 64px;
  border: solid 1px #e0e0e0;
  border-radius: 3px;
  text-align: center;
  margin-bottom: 32px;
  box-shadow: 1px 1px 6px rgba(28, 28, 28, 0.1);
  transition: box-shadow 0.2s ease-in-out;

  :hover {
    box-shadow: 1px 1px 3px rgba(28, 28, 28, 0.05);
  }

  hr {
    margin: 12px -12px;
  }
`

const SSRLayout: FlashCardFunction = ({ data }) => (
  <>
    <CategoryTitle>
      <strong>{data.cards.length}</strong> flascards in the{" "}
      <strong>{data.category}</strong> category
    </CategoryTitle>
    <CardList>
      {data.cards.map(({ front, back }, i) => (
        <CardEntry key={i + "-card"}>
          {front}
          <hr />
          {back}
        </CardEntry>
      ))}
    </CardList>
    <br />
    To use test yourself on this list,{" "}
    <Link to={"/notes"}>return to the library</Link> and open this card from
    there.
  </>
)

export const FlashcardsNote: FlashCardFunction = props =>
  props.modal ? ModalLayout(props) : SSRLayout(props)
