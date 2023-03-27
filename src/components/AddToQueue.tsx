import { useState } from "react"
import styled from "styled-components"
import { v4 as uuidv4 } from "uuid"

import { useQueue } from "~hooks/useQueue"
import type { Level } from "~types"

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
    if (link === "") {
      setResult("Please enter the link to the question.")
      return
    } else if (question === "") {
      setResult("Please enter the name of the question.")
    } else if (remindDays === "") {
      setResult("Please enter when you would like to be remiended.")
    } else {
      const today = new Date()
      const rd = parseInt(remindDays)
      const remindDate = addDays(today, rd).toISOString().slice(0, 10)

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
    }
  }

  return (
    <Container>
      <Text fontSize={14}>{`Select a leetcode question and choose when 
        you would like to be reminded to solve it.`}</Text>
      <QuestionContainer>
        <AddQuestionBox>
          <Text fontSize={14}>{"Remind me of"}</Text>
          <AddQuestionInput
            type="text"
            value={question}
            placeholder="Enter the question"
            onChange={(e) => setQuestion(e.target.value)}
          />
        </AddQuestionBox>
        <AddQuestionBox>
          <Text fontSize={14}>{"Remind me in"}</Text>
          <AddQuestionInput
            type="text"
            value={remindDays}
            placeholder="X number of days"
            onChange={(e) => setRemindDays(e.target.value)}
          />
        </AddQuestionBox>
      </QuestionContainer>
      <QuestionContainer>
        <AddQuestionBox>
          <Text fontSize={14}>{"Question URL"}</Text>
          <AddQuestionInput
            type="text"
            value={link}
            placeholder="Enter the url"
            onChange={(e) => setLink(e.target.value)}
          />
        </AddQuestionBox>
        <AddQuestionBox>
          <Text fontSize={14}>{"Difficulty"}</Text>
          <AddQuestionSelect
            value={level}
            placeholder="Enter the url"
            onChange={(e) => setLevel(e.target.value as Level)}>
            {["Easy", "Medium", "Hard"].map((l, i) => (
              <option key={i} value={l}>
                {l}
              </option>
            ))}
          </AddQuestionSelect>
        </AddQuestionBox>
      </QuestionContainer>
      <AddQuestionButton onClick={handleSubmit}>
        {"Add Question to Queue"}
      </AddQuestionButton>
      <Text fontSize={14} align={"center"}>
        {result}
      </Text>
    </Container>
  )
}

const Container = styled.div`
  gap: 16px;
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

const AddQuestionInput = styled.input`
  width: 130px;
  padding: 12px;
  font-size: 14px;
  border-radius: 5px;
  color: ${(p) => p.theme.colors.gray};
  background: ${(p) => p.theme.colors.off_white};
  border: ${(p) => p.theme.colors.off_white} solid 1px;
  &:focus {
    border: ${(p) => p.theme.colors.blue} solid 1px;
    outline: ${(p) => p.theme.colors.light_blue} solid 2px;
    outline-offset: 0.8px;
  }
`

const AddQuestionSelect = styled.select`
  width: 130px;
  padding: 12px;
  font-size: 14px;
  border-radius: 5px;
  color: ${(p) => p.theme.colors.gray};
  background: ${(p) => p.theme.colors.off_white};
  border: ${(p) => p.theme.colors.off_white} solid 1px;
  &:focus {
    border: ${(p) => p.theme.colors.blue} solid 1px;
    outline: ${(p) => p.theme.colors.light_blue} solid 2px;
    outline-offset: 0.8px;
  }
`

const AddQuestionButton = styled.div`
  font-size: 16px;
  cursor: pointer;
  text-align: center;
  border-radius: 4px;
  padding: 4px 8px 4px 8px;
  color: ${(p) => p.theme.colors.white};
  background: ${(p) => p.theme.colors.blue};
  &:hover {
    opacity: 0.9;
    transition-property: all;
    transition-duration: 200ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
`
