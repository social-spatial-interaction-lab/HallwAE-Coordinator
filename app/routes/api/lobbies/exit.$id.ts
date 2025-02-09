import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const APIRoute = createAPIFileRoute('/api/lobbies/exit/$id')({
  DELETE: async ({ params, request }) => {
    const { id } = params
    const body = await request.json()

    await client.mutation(api.lobby.exitLobby, {
      lobby_id: id,
    })
    await client.mutation(api.history.createHistory, {
      lobby_id: id,
      player_id: body.player_id,
      action_type: 'leave'
    })
    return json({ success: true })
  },
})

