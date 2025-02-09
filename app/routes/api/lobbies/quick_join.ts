import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const APIRoute = createAPIFileRoute('/api/lobbies/quick_join')({
  POST: async ({ params, request }) => {
    return handleQuickJoin(await request.json())
  },
})

async function handleQuickJoin(body: any) {
  const availableLobby = await client.query(api.lobby.getAvailableLobby)

  if (availableLobby) {
    await client.mutation(api.lobby.joinLobby, {
      lobby_id: availableLobby._id,
      playerId: body.playerId,
    })

    await client.mutation(api.lobby.)

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
