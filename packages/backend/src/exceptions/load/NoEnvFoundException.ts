import { Exception } from "@fasteerjs/exceptions";
import c from "chalk"

export class NoEnvFoundException extends Exception {
  constructor(envKey: string) {
    super(c.red(`Environment variable ${c.bold(envKey)} was not found.`))
  }
}
