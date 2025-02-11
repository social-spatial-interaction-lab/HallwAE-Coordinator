import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const APIRoute = createAPIFileRoute('/api/player/register/$player_id')({
  POST: async ({ params }) => {
    const { player_id } = params
    const player = await client.mutation(api.players.createPlayer, {
      player_id,
    })
    return json({ player })
  },
})
