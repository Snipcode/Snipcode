import { log } from "../container"

export interface CanBeException {
  name?: string
  message?: string
}

export const logException = (e?: CanBeException, additionalMessage?: string | null) => {
  try {
    log().error(`${additionalMessage ? `${additionalMessage}: ` : ""}${e?.name} - ${e.message}`)
    log().error(e)
  } catch {

  }
}
