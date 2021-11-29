import { createDatabase } from "./db/createDatabase"
import { createServer } from "./server/createServer"

createDatabase().then((db) => {
  const app = createServer({ db })

  app.start(true)
})
