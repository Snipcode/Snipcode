import { UnauthorizedException } from '@fasteerjs/exceptions'
import { db } from '../../../container'
import { deletePaste } from '../../../db/paste/actions/deletePaste'
import { resolvePasteById } from '../../../db/paste/actions/resolvePaste'
import {
  revokeShareOfPaste,
  sharePaste,
} from '../../../db/paste/actions/sharePaste'
import { resolveUserByUsername } from '../../../db/user/actions/resolveUser'
import { SharePasteException } from '../../../exceptions/http/SharePasteException'
import { Controller } from '../../../types/http'
import { success } from '../../../utils/response'
import {
  withOptionalUserContext,
  withUserContext,
} from '../../context/userContext'
import { FetchRequest, fetchSchema } from '../../schema/commonSchema'
import { SharePasteRequest, sharePasteSchema } from '../../schema/pasteSchema'

const PasteController: Controller = async (app) => {
  app.get<FetchRequest>(
    '/:id',
    { schema: fetchSchema.valueOf() },
    async (req, res) =>
      withOptionalUserContext({ req, res }, async ({ user }) => {
        const paste = await resolvePasteById(req.params.id)

        // Checks whether the paste is public, if not then
        // checks whether the current user id matches the author id.
        if (!paste.public && user.id !== paste.userId)
          if (!paste.shareAccessWith.some((u) => u.id === user.id))
            // If the paste is not user's own and it's not public,
            // check if the author shared access with the user.
            throw new UnauthorizedException(
              'You are not allowed to access this paste.'
            )

        return res.send(success({ paste }))
      })
  )

  app.delete<FetchRequest>(
    '/:id',
    { schema: fetchSchema.valueOf() },
    async (req, res) =>
      withUserContext({ req, res }, async ({ user }) => {
        const paste = await resolvePasteById(req.params.id)

        // Checks whether the current user is the author of
        // the post by comparing the ids.
        if (user.id !== paste.userId)
          throw new UnauthorizedException('This is not your paste.')

        await deletePaste({ id: req.params.id })

        res.send(success())
      })
  )

  app.post<SharePasteRequest>(
    '/share/:id',
    { schema: sharePasteSchema.valueOf() },
    async (req, res) =>
      withUserContext({ req, res }, async ({ user }) => {
        const paste = await resolvePasteById(req.params.id)

        // There is no need for sharing access if the paste is public.
        if (paste.public)
          throw new UnauthorizedException('This paste is public.')

        // Checks whether the current user is the author of
        // the post by comparing the ids.
        if (user.id !== paste.userId)
          throw new UnauthorizedException('This is not your paste.')

        // Fetch user that the paste author wants to share the paste with.
        // If the user does not exist an exception will be thrown.
        const shareWithUser = await resolveUserByUsername(req.body.username)

        // Check whether the paste is not already shared with this user.
        if (paste.shareAccessWith.some((u) => u.id === shareWithUser.id))
          throw new SharePasteException(
            'You already share this paste with that user.'
          )

        await sharePaste(paste, shareWithUser)

        return res.send(success())
      })
  )

  app.post<SharePasteRequest>(
    '/revokeShare/:id',
    { schema: sharePasteSchema.valueOf() },
    async (req, res) =>
      withUserContext({ req, res }, async ({ user }) => {
        const paste = await resolvePasteById(req.params.id)

        // There is no need for sharing access if the paste is public.
        if (paste.public)
          throw new UnauthorizedException('This paste is public.')

        // Checks whether the current user is the author of
        // the post by comparing the ids.
        if (user.id !== paste.userId)
          throw new UnauthorizedException('This is not your paste.')

        // Fetch user that the paste author wants to revoke share of the paste for.
        // If the user does not exist an exception will be thrown.
        const revokeShareFrom = await resolveUserByUsername(req.body.username)

        // Check whether the paste is actually shared with this user.
        if (!paste.shareAccessWith.some((u) => u.id === revokeShareFrom.id))
          throw new SharePasteException(
            "You don't share the post with this user."
          )

        await revokeShareOfPaste(paste, revokeShareFrom)

        return res.send(success())
      })
  )
}

export const routePrefix = '/api/user'

export default PasteController
