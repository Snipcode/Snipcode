import s from 'fluent-json-schema'
import { FetchRequest, fetchSchema } from './commonSchema'

export interface SharePasteRequest extends FetchRequest {
  Body: {
    username: string
  }
}

export const sharePasteSchema = fetchSchema.prop(
  'body',
  s.required().object().prop('username', s.required())
)
