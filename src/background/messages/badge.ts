import type { PlasmoMessaging } from "@plasmohq/messaging"

import { updateBadge } from "~background"

const handle: PlasmoMessaging.MessageHandler = async (req, res) => {
  await updateBadge()
  res.send("success")
}

export default handle
