import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const APIRoute = createAPIFileRoute(
  '/api/lobbies/unregister/$id/$player_id',
)({
  DELETE: async ({ params }) => {
    const { id, player_id } = params
    // quit should be seperated with lobby unregister
    // check whether the user is the creator of the lobby
    const lobby = await client.query(api.lobby.getLobby, { id })
    if (lobby && lobby.creator_id !== player_id) {
      return new Response("Not lobby's creator, cannot delete", { status: 400 })
    }
    await client.mutation(api.lobby.deleteLobby, { id })
    return json({ success: true })
  },
})
