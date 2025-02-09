import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const APIRoute = createAPIFileRoute('/api/lobbies/quick_join')({
  POST: async ({ request }) => {
    return handleQuickJoin(await request.json())
  },
})

async function handleQuickJoin(body: any) {
  const availableLobby = await client.query(api.lobby.getAvailableLobby)

  if (availableLobby) {
    const lobby_id = availableLobby.id
    await client.mutation(api.lobby.joinLobby, {
      lobby_id,
    })

    await client.mutation(api.history.createHistory, {
      lobby_id,
      player_id: body.player_id,
      action_type: 'join'
    })

    return json({
      lobby_id,
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
