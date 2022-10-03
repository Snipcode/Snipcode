import { SocketStream } from '@fastify/websocket'
import { FastifyRequest } from 'fastify'
import { $globals } from '../../data/Globals'
import { UserChannelEmits } from '../../data/UserChannel'
import { createUserContext } from '../context/userContext'
import { controller } from '../plugins/controllers'
import { $ws, socketSend } from '../websocket'

export default controller(async (server) => {
  $ws('/ws', async (conn: SocketStream, req: FastifyRequest) => {
    const ctx = await createUserContext({ req })

    if (!ctx.success) {
      return socketSend(conn.socket, ctx)
    }

    const { user } = ctx

    /**
     * Get User channel or create a new one.
     */
    const channel = $globals.findOrCreateUserChannelByUserId(user.id)

    /**
     * UserChannel Events
     */

    channel.onPasteCreate((paste) => {
      socketSend(conn.socket, {
        event: UserChannelEmits.PasteCreate,
        data: { paste },
      })
    })

    channel.onPasteEdit((paste) => {
      socketSend(conn.socket, {
        event: UserChannelEmits.PasteEdit,
        data: { paste },
      })
    })

    channel.onPasteDelete((paste) => {
      socketSend(conn.socket, {
        event: UserChannelEmits.PasteDelete,
        data: { paste },
      })
    })

    // When the channel is closed, close connection as well.
    // If there is another client opened, it will attempt to reconnect
    // and another channel will be created.
    channel.onClose(() => conn.end())

    // Remove channel when connection is closed instead of keeping
    // it in memory and flooding resources. As mentioned before, this will close
    // all connections and if there is any opened client then it will reconnect and create
    // a new bag.
    conn.on('close', () => {
      $globals.removeUserChannel(channel)
    })
  })
})
