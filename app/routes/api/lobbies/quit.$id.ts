import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const APIRoute = createAPIFileRoute('/api/lobbies/quit/$id')({
  DELETE: async ({ params, request }) => {
    const { id } = params
    const { action } = await request.json()

    switch (action) {
      case 'register':
        return handleRegisterLobby(id, await request.json())
      case 'unregister':
        await client.mutation(api.lobby.deleteLobby, { id })
        return json({ success: true })
      default:
        return new Response('Invalid action', { status: 400 })
    }
  },
})

async function handleRegisterLobby(lobbyId: string, body: any) {
  const { maxPlayers, playerId, creationToken } = body

  const validToken = await client.query(api.lobby.validateCreationToken, {
    token: creationToken,
  })
  if (!validToken) {
    return new Response('Invalid creation token', { status: 400 })
  }

  await client.mutation(api.lobby.createLobby, {
    id: lobbyId,
    player_count: 1,
    max_players: maxPlayers,
    creator_id: playerId,
  })

  return json({ success: true })
}
