// @ts-ignore missing typedef
import {Eggy} from "@s-r0/eggy-js"

export interface EggyOptions {
  title: string | false,
  message: string | false,
  duration: number,
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
  type: 'success' | 'warning' | 'info' | 'error',
  styles: boolean,
  progressBar: boolean
}

export const notifyDefaultOptions: Partial<EggyOptions> = {
  duration: 2000,
  type: 'info',
  position: 'bottom-left',
  title: false,
}


export const notify = (opts: Partial<EggyOptions>) => Eggy({
  ...notifyDefaultOptions,
  ...opts
})
