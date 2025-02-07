import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import {
  lobbyQueries,
  historyQueries,
  useCreateLobbyMutation,
  useDeleteLobbyMutation,
  useJoinLobbyMutation,
  useHandleCreationLockMutation,
} from '~/lobbyQueries'

export const APIRoute = createAPIFileRoute('/api/lobbies/$id')({
  GET: async ({ params }) => {
    const lobby = await lobbyQueries.detail(params.id)
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
        const deleteMutation = useDeleteLobbyMutation()
        await deleteMutation.mutateAsync({ id: params.id })
        return json({ success: true })
      default:
        return new Response("Invalid action", { status: 400 })
    }
  },
})

async function handleQuickJoin(lobbyId: string, body: any) {
  const availableLobby = await lobbyQueries.getAvailableLobby()
  const joinMutation = useJoinLobbyMutation()
  const creationLockMutation = useHandleCreationLockMutation()

  if (availableLobby) {
    await joinMutation.mutateAsync({
      lobby_id: availableLobby.id,
      playerId: body.playerId,
    })

    return json({
      lobby_id: availableLobby.id,
      should_create: false,
      creation_token: 0,
    })
  }

  const creationLock = await creationLockMutation.mutateAsync({})
  
  return json({
    lobby_id: null,
    join_code: null,
    should_create: true,
    creation_token: creationLock.token,
  })
}

async function handleRegisterLobby(lobbyId: string, body: any) {
  const { maxPlayers, playerId, creationToken } = body

  const validToken = await lobbyQueries.validateCreationToken(creationToken)
  if (!validToken) {
    return new Response("Invalid creation token", { status: 400 })
  }

  const createMutation = useCreateLobbyMutation()
  await createMutation.mutateAsync({
    id: lobbyId,
    player_count: 1,
    max_players: maxPlayers,
    creator_id: playerId,
  })

  return json({ success: true })
}

export const Route = createAPIFileRoute('/api/lobbies/$id')({
  GET: async ({ params }) => {
    const history = await historyQueries.listByLobby(params.id)
    return json(history)
  },
})
