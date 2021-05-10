import { Paste } from '@snipcode/backend/src/http/schemas'
import { PasteDto } from '@snipcode/core/src/dto/pasteDto'
import {
  Error,
  Success,
} from '@snipcode/backend/src/http/helpers/responseHelper'
import { $axios } from '../axios'

const create = ({ content, public: _public }: Paste.Create['Body']['data']) =>
  $axios.request<Success<{ paste: PasteDto }> | Error<any>>({
    url: '/paste',
    method: 'PUT',
    data: {
      data: { content, public: _public },
    },
  })

const edit = ({ id, content, public: _public }: Paste.Edit['Body']['data']) =>
  $axios.request<Success<{ paste: PasteDto }> | Error<any>>({
    url: '/paste',
    method: 'POST',
    data: {
      data: { id, content, public: _public },
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

export { create, get, remove, edit }
