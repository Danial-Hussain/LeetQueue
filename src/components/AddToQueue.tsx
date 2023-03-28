import { useState } from "react"
import styled from "styled-components"
import { v4 as uuidv4 } from "uuid"

import { sendToBackground } from "@plasmohq/messaging"

import { useQueue } from "~hooks/useQueue"
import type { Level } from "~types"

import Input from "./Input"

const addDays = function (prevDate: Date, days: number) {
  var date = new Date(prevDate.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

export const AddToQueue = () => {
  const [link, setLink] = useState<string>("")
  const [level, setLevel] = useState<Level>("Easy")
  const [question, setQuestion] = useState<string>("")
  const [remindDays, setRemindDays] = useState<string>("")

  const { addToQueue } = useQueue()
  const [result, setResult] = useState<string>("")

  const handleSubmit = async () => {
    if (question === "") {
      setResult("Please enter the name of the question.")
    } else if (remindDays === "") {
      setResult("Please enter when you would like to be remiended.")
    } else {
      const remindDate = addDays(new Date(), parseInt(remindDays))
        .toISOString()
        .slice(0, 10)

      addToQueue({
        id: uuidv4(),
        name: question,
        level: level,
        link: link,
        date: remindDate
      })

      setResult("Question added to the queue.")
      setTimeout(() => setResult(""), 1500)
      setLink("")
      setQuestion("")
      setLevel("Easy")
      setRemindDays("")

      await sendToBackground({ name: "badge" })
    }
  }

  return (
    <Container>
      <Text fontSize={16}>{`Select a leetcode question and choose when 
        you would like to be reminded to solve it.`}</Text>
      <QuestionContainer>
        <AddQuestionBox>
          <Text fontSize={14} style={{ marginLeft: "4px" }}>
            {"Remind me of"}
          </Text>
          <Input
            autoFocus={true}
            value={question}
            name={"question name"}
            label={"Question Name"}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </AddQuestionBox>
        <AddQuestionBox>
          <Text fontSize={14} style={{ marginLeft: "4px" }}>
            {"Remind me in"}
          </Text>
          <Input
            value={remindDays}
            label={"Number of Days"}
            name={"question reminder"}
            placeholder="X number of days"
            onChange={(e) => setRemindDays(e.target.value)}
          />
        </AddQuestionBox>
      </QuestionContainer>
      <QuestionContainer>
        <AddQuestionBox>
          <Text fontSize={14} style={{ marginLeft: "4px" }}>
            {"URL (optional)"}
          </Text>
          <Input
            value={link}
            name={"question url"}
            label={"Question Link"}
            placeholder="Enter the url"
            onChange={(e) => setLink(e.target.value)}
          />
        </AddQuestionBox>
        <AddQuestionBox>
          <Text fontSize={14} style={{ marginLeft: "4px" }}>
            {"Question Difficulty"}
          </Text>
          <AddQuestionSelect
            value={level}
            placeholder="Enter the url"
            onChange={(e) => setLevel(e.target.value as Level)}>
            {["Easy", "Medium", "Hard"].map((l, i) => (
              <option key={i} value={l} style={{ fontSize: "16px" }}>
                {l}
              </option>
            ))}
          </AddQuestionSelect>
        </AddQuestionBox>
      </QuestionContainer>
      <AddQuestionButton onClick={handleSubmit}>
        {"Add Question to Queue"}
      </AddQuestionButton>
      <Text fontSize={16} align={"center"} style={{ paddingBottom: "12px" }}>
        {result}
      </Text>
    </Container>
  )
}

const Container = styled.div`
  gap: 18px;
  display: flex;
  height: 250px;
  flex-direction: column;
  margin: 20px 0px 20px 0px;
  padding: 0px 0px 20px 0px;
`

const QuestionContainer = styled.div`
  gap: 10px;
  display: flex;
  flex-direction: row;
`

const Text = styled.div<{ fontSize: number; align?: string }>`
  text-align: ${(p) => p.align};
  font-size: ${(p) => p.fontSize}px;
  color: ${(p) => p.theme.colors.gray};
`

const AddQuestionBox = styled.div`
  display: flex;
  flex-direction: column;
`

const AddQuestionSelect = styled.select`
  width: 180px;
  height: 100%;
  border: none;
  padding: 12px;
  font-size: 16px;
  border-radius: 7px;
  color: ${(p) => p.theme.colors.gray};
  background: ${(p) => p.theme.colors.off_white};
`

const AddQuestionButton = styled.div`
  padding: 8px;
  font-size: 16px;
  cursor: pointer;
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
