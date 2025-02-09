import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const APIRoute = createAPIFileRoute('/api/lobbies/$id')({
  GET: async ({ params }) => {
    const lobby = await client.query(api.lobby.getLobby, { id: params.id })
    return json(lobby)
  },
  POST: async ({ params, request }) => {
    const { action } = await request.json()

    switch (action) {
      case 'quick_join':
        return handleQuickJoin(params.id, await request.json())
      case 'register':
        return handleRegisterLobby(params.id, await request.json())
      case 'unregister':
        await client.mutation(api.lobby.deleteLobby, { id: params.id })
        return json({ success: true })
      default:
        return new Response("Invalid action", { status: 400 })
    }
  },
})

// TODO: move to api/lobbies/index?
async function handleQuickJoin(lobbyId: string, body: any) {
  const availableLobby = await client.query(api.lobby.getAvailableLobby)

  if (availableLobby) {
    await client.mutation(api.lobby.joinLobby, {
      lobby_id: availableLobby._id,
      playerId: body.playerId,
    })

    return json({
      lobby_id: availableLobby._id,
      should_create: false,
      creation_token: 0,
    })
  }

  const creationLock = await client.mutation(api.lobby.handleCreationLock)

  return json({
    lobby_id: null,
    join_code: null,
    should_create: true,
    creation_token: creationLock.token,
  })
}

async function handleRegisterLobby(lobbyId: string, body: any) {
  const { maxPlayers, playerId, creationToken } = body

  const validToken = await client.query(api.lobby.validateCreationToken, { token: creationToken })
  if (!validToken) {
    return new Response("Invalid creation token", { status: 400 })
  }

  await client.mutation(api.lobby.createLobby, {
    id: lobbyId,
    player_count: 1,
    max_players: maxPlayers,
    creator_id: playerId,
  })

  return json({ success: true })
}

