import { Storage } from "@plasmohq/storage"

import {
  STORAGE_QUESTIONS_COMPLETED,
  STORAGE_QUESTIONS_DISMISSED
} from "~constants"

export const useStats = () => {
  const storage = new Storage({ area: "local" })

  const incrementCompleted = async () => {
    let completed = await storage.get(STORAGE_QUESTIONS_COMPLETED)
    let completedNew = 0
    if (completed !== undefined) {
      completedNew += 1 + parseInt(completed)
    }
    await storage.set(STORAGE_QUESTIONS_COMPLETED, completedNew)
  }

  const incrementDismissed = async () => {
    let dismissed = await storage.get(STORAGE_QUESTIONS_DISMISSED)
    let dismissedNew = 0
    if (dismissed !== undefined) {
      dismissedNew += 1 + parseInt(dismissed)
    }
    await storage.set(STORAGE_QUESTIONS_DISMISSED, dismissedNew)
  }

  const getCompleted = async () => {
    let completed = await storage.get(STORAGE_QUESTIONS_COMPLETED)
    return completed === undefined ? 0 : parseInt(completed)
  }

  return { incrementCompleted, incrementDismissed, getCompleted }
}
