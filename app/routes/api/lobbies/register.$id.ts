import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const APIRoute = createAPIFileRoute('/api/lobbies/register/$id')({
  POST: async ({ params, request }) => {
    const { id } = params
    return handleRegisterLobby(id, await request.json())
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
