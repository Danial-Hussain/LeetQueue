export type Level = "Easy" | "Medium" | "Hard"

export interface Question {
  id: string
  date: string
  name: string
  link: string
  level: Level
}
