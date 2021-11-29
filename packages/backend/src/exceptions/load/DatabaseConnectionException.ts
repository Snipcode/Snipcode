import { Exception } from "@fasteerjs/exceptions";
import c from "chalk";

export class DatabaseConnectionException extends Exception {
  constructor(message: string) {
    super(c.red(`Connection to database failed: ${c.bold(message)}`))
  }
}
