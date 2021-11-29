import {useServices} from "contairy"
import { SnipcodeContainer } from "./types/http"

export const services = () => useServices<SnipcodeContainer>()

export const service = <T extends keyof SnipcodeContainer>(service: T): SnipcodeContainer[T] => services()[service]

export const db = () => service("db")

export const log = () => service("logger")
