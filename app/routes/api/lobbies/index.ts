import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const APIRoute = createAPIFileRoute('/api/lobbies')({
  GET: async () => {
    const lobbies = await client.query(api.lobby.getLobbies)
    return json(lobbies)
  },
})
