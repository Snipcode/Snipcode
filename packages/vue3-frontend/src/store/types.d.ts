import { DefineComponent } from 'vue'

interface Alert {
  type?: 'info' | 'warning' | 'success' | 'error'
  content: string | DefineComponent
  to?: string
  href?: string
}
