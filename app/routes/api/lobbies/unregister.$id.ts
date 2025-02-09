import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const APIRoute = createAPIFileRoute('/api/lobbies/unregister/$id')({
  DELETE: async ({ params }) => {
    const { id } = params
    await client.mutation(api.lobby.deleteLobby, { id })
    return json({ success: true })
  },
})

