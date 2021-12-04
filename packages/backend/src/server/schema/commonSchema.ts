import s from 'fluent-json-schema'

export interface FetchRequest {
  Params: {
    id: string
  }
}

export const fetchSchema = s
  .object()
  .prop('params', s.object().required().prop('id', s.string().required()))
