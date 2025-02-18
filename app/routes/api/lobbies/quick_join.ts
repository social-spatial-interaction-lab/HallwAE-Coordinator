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
  const { player_id } = body
  await client.mutation(api.players.createPlayer, {
    player_id,
  })

  const availableLobby = await client.query(api.lobby.getAvailableLobby)
  // either join or create a new lobby
  if (availableLobby) {
    const lobby_id = availableLobby.id

    return json({
      lobby_id,
      should_create: false,
      creation_token: 0,
    })
  }

  const creationLock = await client.mutation(api.lobby.handleCreationLock)

  return json({
    lobby_id: null,
    should_create: true,
    creation_token: creationLock.token,
  })
}
