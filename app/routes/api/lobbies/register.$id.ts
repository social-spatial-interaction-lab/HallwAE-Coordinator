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

async function handleRegisterLobby(lobby_id: string, body: any) {
  const { max_players, player_id, player_name, creation_token } = body
  await client.mutation(api.players.createPlayer, {
    player_id,
    player_name
  })

  const validToken = await client.query(api.lobby.validateCreationToken, {
    token: creation_token,
  })
  if (!validToken) {
    return new Response('Invalid creation token', { status: 400 })
  }

  await client.mutation(api.lobby.createLobby, {
    id: lobby_id,
    player_count: 1,
    max_players: max_players,
    creator_id: player_id,
  })

  await client.mutation(api.history.createHistory, {
    lobby_id,
    player_id: player_id,
    action_type: 'join'
  })


  return json({ success: true })
}
