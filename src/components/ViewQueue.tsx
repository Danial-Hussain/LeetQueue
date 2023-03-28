import { motion, useAnimate } from "framer-motion"
import { useEffect, useState } from "react"
import styled from "styled-components"

import { sendToBackground } from "@plasmohq/messaging"

import { useQueue } from "~hooks/useQueue"
import { useStats } from "~hooks/useStats"
import { CheckIcon, RemoveIcon } from "~icons"
import type { Tab } from "~popup"
import { theme } from "~styles/theme"
import type { Level, Question } from "~types"

interface QueueProps {
  filter: Filter
  setTab: (tab: Tab) => void
  completed: number
  setCompleted: (completed: number) => void
}

export const Queue: React.FC<QueueProps> = ({
  filter,
  setTab,
  completed,
  setCompleted
}) => {
  const [scope, animate] = useAnimate()
  const [questions, setQuestions] = useState<Question[]>([])
  const { getQueue, addToQueue, removeFromQueue } = useQueue()
  const { incrementCompleted, incrementDismissed } = useStats()

  useEffect(() => {
    ;(async () => {
      const newQuestions = await getQueue(filter)
      setQuestions(newQuestions)
    })()
  }, [filter])

  const offset = 15
  const qLength = questions.length
  const maxLength = Math.min(4, qLength)

  const findZi = (i: number) => qLength - i
  const findMt = (i: number) =>
    maxLength - Math.min(i, maxLength) * offset + offset * maxLength

  const handleComplete = () => {
    animate(
      "#front",
      {
        y: 5,
        x: 200,
        opacity: 0.5,
        background: theme.colors.light_green
      },
      {
        x: { delay: 0.3 },
        y: { duration: 0.1 },
        opacity: { duration: 0.2, delay: 0.1 }
      }
    ).then(() => {
      removeFromQueue(questions[0])
      setQuestions([...questions.slice(1)])
      incrementCompleted()
      setCompleted(completed + 1)
      sendToBackground({ name: "badge" })
    })
  }

  const handleRemove = () => {
    animate(
      "#front",
      {
        y: 5,
        x: -200,
        opacity: 0.5,
        background: theme.colors.light_red
      },
      {
        x: { delay: 0.3 },
        y: { duration: 0.1 },
        opacity: { duration: 0.2, delay: 0.1 }
      }
    ).then(() => {
      removeFromQueue(questions[0])
      setQuestions([...questions.slice(1)])
      incrementDismissed()
      sendToBackground({ name: "badge" })
    })
  }

  const requeue = () => {
    animate("#front", { top: -offset }).then(() => {
      removeFromQueue(questions[0]).then(() => addToQueue(questions[0]))
      setQuestions([...questions.slice(1), questions[0]])
    })
  }

  return (
    <QueueContainer ref={scope}>
      {questions.map((e, i) => (
        <QueueEntry
          key={e.id}
          as={motion.div}
          id={i === 0 ? "front" : "back"}
          initial={{ top: 0, zIndex: findZi(i) }}
          animate={{
            top: findMt(i),
            zIndex: findZi(i),
            transition: {
              delay: 0.2,
              bounce: 0.3,
              type: "spring",
              opacity: { delay: 0.03 }
            }
          }}>
          <QueueEntryBox direction="col" padding="0px 0px 0px 12px;">
            <QueueEntryBox direction="row" align="center">
              <QueueEntryQuestionName>
                {e.name.slice(0, 25)} {e.name.length >= 25 && "..."}
              </QueueEntryQuestionName>
              <QueueEntryQuestionLevel variant={e.level}>
                {e.level}
              </QueueEntryQuestionLevel>
            </QueueEntryBox>
            {e.link !== "" && (
              <QueueEntryQuestionLink href={e.link}>
                {"Go to question"}
              </QueueEntryQuestionLink>
            )}
          </QueueEntryBox>
          <QueueEntryBox direction="row">
            <QueueEntryActionButton onClick={handleComplete}>
              <CheckIcon />
            </QueueEntryActionButton>
            <QueueEntryActionButton onClick={handleRemove}>
              <RemoveIcon />
            </QueueEntryActionButton>
          </QueueEntryBox>
        </QueueEntry>
      ))}
      {questions.length === 0 ? (
        <QueueEmptyContainer>
          <QueueEmptyText>
            {"There are no questions in the queue"}
          </QueueEmptyText>
          <QueueEmptyText>{"Start by adding a question"}</QueueEmptyText>
          <AddQuestionButton onClick={() => setTab("Add")}>
            {"Add to Queue"}
          </AddQuestionButton>
        </QueueEmptyContainer>
      ) : (
        <RequeueButtonContainer>
          <RequeueButton offset={findMt(0) + offset * 5} onClick={requeue}>
            {"Requeue"}
          </RequeueButton>
        </RequeueButtonContainer>
      )}
    </QueueContainer>
  )
}

export type Filter = "today" | "all time"

interface ViewQueueProps {
  completed: number
  setTab: (tab: Tab) => void
  setCompleted: (completed: number) => void
}

export const ViewQueue: React.FC<ViewQueueProps> = ({
  setTab,
  completed,
  setCompleted
}) => {
  const [filter, setFilter] = useState<Filter>("today")

  return (
    <Container>
      <FiltersContainer>
        <Filter
          selected={filter === "today"}
          onClick={() => setFilter("today")}>
          {"Today"}
        </Filter>
        <Filter
          selected={filter === "all time"}
          onClick={() => setFilter("all time")}>
          {"All Time"}
        </Filter>
      </FiltersContainer>
      <Queue
        filter={filter}
        setTab={setTab}
        completed={completed}
        setCompleted={setCompleted}
      />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  height: 250px;
  flex-direction: column;
  margin: 20px 0px 20px 0px;
`

const FiltersContainer = styled.div`
  gap: 4px;
  display: flex;
`

const Filter = styled.div<{ selected: boolean }>`
  font-size: 12px;
  cursor: pointer;
  border-radius: 10px;
  padding: 2px 8px 2px 8px;
  color: ${(p) =>
    p.selected ? p.theme.colors.white : p.theme.colors.dark_gray};
  background: ${(p) =>
    p.selected ? p.theme.colors.blue : p.theme.colors.light_white};
`

const QueueContainer = styled.div`
  position: relative;
  padding-top: 20px;
  padding-bottom: 80px;
  margin: 16px 0px 16px 0px;
`

const QueueEntry = styled.div`
  width: 100%;
  height: 50px;
  padding: 2px;
  display: flex;
  position: absolute;
  border-radius: 10px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  background: ${(p) => p.theme.colors.light_white};
`

const QueueEntryBox = styled.div<{
  align?: string
  padding?: string
  justify?: string
  direction: "row" | "col"
}>`
  display: flex;
  padding: ${(p) => p.padding};
  align-items: ${(p) => p.align && p.align};
  justify-content: ${(p) => p.justify && p.justify};
  flex-direction: ${(p) => (p.direction === "row" ? "row" : "column")};
`

const QueueEntryQuestionName = styled.div`
  font-size: 14px;
  margin-right: 8px;
  color: ${(p) => p.theme.colors.gray};
`

const QueueEntryQuestionLevel = styled.div<{ variant: Level }>`
  font-size: 10px;
  font-weight: 700;
  border-radius: 20px;
  padding: 2px 10px 2px 10px;
  color: ${(p) =>
    p.variant === "Easy"
      ? p.theme.colors.green
      : p.variant === "Medium"
      ? theme.colors.orange
      : theme.colors.red};
  background: ${(p) =>
    p.variant === "Easy"
      ? p.theme.colors.light_green
      : p.variant === "Medium"
      ? theme.colors.light_orange
      : theme.colors.light_red};
`

const QueueEntryQuestionLink = styled.a`
  font-size: 12px;
  color: ${(p) => p.theme.colors.light_blue};
`

const QueueEntryActionButton = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  cursor: pointer;
  border-radius: 20px;
  align-items: center;
  margin: 0px 4px 0px 4px;
  justify-content: center;
  background: transparent;
`

const RequeueButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const RequeueButton = styled.div<{ offset: number }>`
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  border-radius: 4px;
  padding: 4px 8px 4px 8px;
  top: ${(p) => p.offset}px;
  color: ${(p) => p.theme.colors.white};
  background: ${(p) => p.theme.colors.blue};
`

const QueueEmptyContainer = styled.div`
  padding: 16px;
`

const QueueEmptyText = styled.div`
  font-size: 16px;
  text-align: center;
  color: ${(p) => p.theme.colors.gray};
`

const AddQuestionButton = styled.div`
  padding: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 24px;
  text-align: center;
  border-radius: 4px;
  color: ${(p) => p.theme.colors.white};
  background: ${(p) => p.theme.colors.blue};
  &:hover {
    opacity: 0.9;
    transition-property: all;
    transition-duration: 200ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
`
