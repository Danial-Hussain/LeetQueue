import { useQueue } from "~hooks/useQueue"

import { theme } from "../styles/theme"

export const updateBadge = async () => {
  const { getQueue } = useQueue()
  const queue = await getQueue("today")
  chrome.action.setBadgeText({ text: `${queue.length}` })
  chrome.action.setBadgeBackgroundColor({
    color: queue.length === 0 ? theme.colors.white : theme.colors.blue
  })
}

updateBadge()
