import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const APIRoute = createAPIFileRoute('/api/players/register/$player_id')({
  POST: async ({ params, request }) => {
    const { player_id } = params
    const body = await request.json()
    const player = await client.mutation(api.players.createPlayer, {
      player_id,
      player_name: body.player_name
    })
    return json(player)
  },
})
