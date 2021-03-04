import { Paste } from '@pastte/backend/src/http/schemas'
import { PasteDto } from '@pastte/backend/src/http/dto/db/pasteDto'
import { Error, Success } from '@pastte/backend/src/http/helpers/responseHelper'
import { $axios, SuccessMessage } from '../axios'

const create = (data: Paste.Create['Body']['data']) =>
  $axios.request<Success<{ paste: PasteDto }> | Error<any>>({
    url: '/paste',
    method: 'PUT',
    data: {
      data,
    },
  })

const get = ({ id }: Paste.ById['Params']) =>
  $axios.request<Success<{ paste: PasteDto }> | Error<any>>({
    url: `/paste/${id}`,
    method: 'GET',
  })

const remove = ({ id }: Paste.ById['Params']) =>
  $axios.request<Success<{ paste: PasteDto }> | Error<any>>({
    url: `/paste/${id}`,
    method: 'DELETE',
  })

export { create, get, remove }
