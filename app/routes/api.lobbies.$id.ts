import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import {
  lobbyQueries,
  historyQueries,
  useCreateLobbyMutation,
  useDeleteLobbyMutation,
} from '~/lobbyQueries'
import { internal } from '../../convex/_generated/api'
import { internalMutation, internalQuery } from '../../convex/_generated/server'

export const APIRoute = createAPIFileRoute('/api/lobbies/$id')({
  GET: async ({ params }) => {
    const lobby = await lobbyQueries.detail(params.id)
    return json(lobby)
  },
  POST: async ({ params, request }) => {
    const { action } = await request.json()

    // Handle different actions via POST body
    switch (action) {
      case 'quick_join':
        return handleQuickJoin(params.id, await request.json())
      case 'register':
        return handleRegisterLobby(params.id, await request.json())
      case 'unregister':
        const deleteMutation = useDeleteLobbyMutation()
        await deleteMutation.mutateAsync({ id: params.id })
        return json({ success: true })
      default:
        return json({ error: 'Invalid action' }, 400)
    }
  },
})

// Quick join handler
async function handleQuickJoin(lobbyId: string, body: any) {
  // Check for available lobbies
  const availableLobby = await internalQuery(internal.lobby.getAvailableLobby)

  if (availableLobby) {
    // Join existing lobby
    await internalMutation(internal.lobby.joinLobby, {
      lobby_id: availableLobby._id,
      playerId: body.playerId,
    })

    return json({
      lobby_id: availableLobby._id,
      join_code: availableLobby.joinCode,
      should_create: false,
      creation_token: 0,
    })
  }

  // Handle creation lock
  const creationLock = await internalMutation(internal.lobby.handleCreationLock)

  return json({
    lobby_id: null,
    join_code: null,
    should_create: true,
    creation_token: creationLock.token,
  })
}

// Lobby registration handler
async function handleRegisterLobby(lobbyId: string, body: any) {
  const { joinCode, maxPlayers, playerId, creationToken } = body

  // Validate creation token
  const validToken = await internalQuery(internal.lobby.validateCreationToken, {
    token: creationToken,
  })
  if (!validToken) {
    return json({ error: 'Invalid creation token' }, 400)
  }

  // Create new lobby
  const createMutation = useCreateLobbyMutation()
  await createMutation.mutateAsync({
    id: lobbyId,
    joinCode,
    maxPlayers,
    creatorId: playerId,
  })

  return json({ success: true })
}

// Add this for lobby history
export const Route = createAPIFileRoute('/api/lobbies/$id')({
  GET: async ({ params }) => {
    const history = await historyQueries.listByLobby(params.id)
    return json(history)
  },
})
