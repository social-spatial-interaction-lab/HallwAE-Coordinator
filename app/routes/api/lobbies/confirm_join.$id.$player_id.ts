import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const APIRoute = createAPIFileRoute(
  '/api/lobbies/confirm_join/$id/$player_id',
)({
  POST: async ({ params }) => {
    const { id, player_id } = params
    return handleConfirmJoin(id, player_id)
  },
})

async function handleConfirmJoin(id: string, player_id: string) {
  const lobby_id = id
  await client.mutation(api.lobby.joinLobby, {
    lobby_id,
  })

  await client.mutation(api.history.createHistory, {
    lobby_id,
    player_id,
    action_type: 'join',
  })

  return json({
    lobby_id,
    should_create: false,
    creation_token: 0,
  })
}
