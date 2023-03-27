import { Storage } from "@plasmohq/storage"

import { STORAGE_LEETCODE_QUEUE } from "~constants"
import type { Question } from "~types"

export const useQueue = () => {
  const storage = new Storage({ area: "local" })

  const addToQueue = async (question: Question) => {
    const dataStr = await storage.get(STORAGE_LEETCODE_QUEUE)
    let dataJson: Question[] = dataStr === undefined ? [] : JSON.parse(dataStr)
    await storage.set(
      STORAGE_LEETCODE_QUEUE,
      JSON.stringify([...dataJson, question])
    )
  }

  const removeFromQueue = async (question: Question) => {
    const dataStr = await storage.get(STORAGE_LEETCODE_QUEUE)
    let dataJson: Question[] = dataStr === undefined ? [] : JSON.parse(dataStr)
    const questionIdx = dataJson.findIndex((d) => d.name === question.name)
    await storage.set(
      STORAGE_LEETCODE_QUEUE,
      JSON.stringify([
        ...dataJson.slice(0, questionIdx),
        ...dataJson.slice(questionIdx + 1)
      ])
    )
  }

  const getQueue = async (filter: string) => {
    let dataStr = await storage.get(STORAGE_LEETCODE_QUEUE)
    console.log(dataStr)
    let dataJson: Question[] = dataStr === undefined ? [] : JSON.parse(dataStr)
    console.log(dataJson)
    if (filter === "today") {
      const today = new Date().toISOString().slice(0, 10)
      dataJson = dataJson.filter((d) => d.date <= today)
    }
    return dataJson
  }

  return { getQueue, addToQueue, removeFromQueue }
}
