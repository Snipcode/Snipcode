import { Paste } from '@snipcode/backend/src/schemas'
import { PasteDto } from '@snipcode/backend/src/dto/db/pasteDto'
import { Error, Success } from '@snipcode/backend/src/utils/response'
import { $axios } from '../axios'

export const create = ({ content, public: _public }: Paste.Create['Body']['data']) =>
  $axios.request<Success<{ paste: PasteDto }> | Error<any>>({
    url: '/paste',
    method: 'PUT',
    data: {
      data: { content, public: _public },
    },
  })

export const edit = ({ id, content, public: _public }: Paste.Edit['Body']['data']) =>
  $axios.request<Success<{ paste: PasteDto }> | Error<any>>({
    url: '/paste',
    method: 'POST',
    data: {
      data: { id, content, public: _public },
    },
  })

export  const get = ({ id }: Paste.ById['Params']) =>
  $axios.request<Success<{ paste: PasteDto }> | Error<any>>({
    url: `/paste/${id}`,
    method: 'GET',
  })

export const getAll = () =>
  $axios.request<Success<{ pastes: PasteDto[] }> | Error<any>>({
    url: `/paste`,
    method: 'GET',
  })

export const remove = ({ id }: Paste.ById['Params']) =>
  $axios.request<Success<{ paste: PasteDto }> | Error<any>>({
    url: `/paste/${id}`,
    method: 'DELETE',
  })
