import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const APIRoute = createAPIFileRoute('/api/players/register/$player_id')({
  POST: async ({ params, request }) => {
    try {
      const { player_id } = params

      // Validate player_id
      if (!player_id || typeof player_id !== 'string') {
        return json({ error: 'Invalid player_id parameter' }, { status: 400 })
      }

      // Safely parse body
      let body
      try {
        body = await request.json()
      } catch (e) {
        return json({ error: 'Invalid JSON body' }, { status: 400 })
      }

      // Validate player_name
      if (!body.player_name || typeof body.player_name !== 'string') {
        return json({ error: 'player_name is required and must be a string' }, { status: 400 })
      }

      // Check if player exists
      const existingPlayer = await client.query(api.players.getPlayer, {
        id: player_id
      })

      // Use appropriate mutation based on whether player exists
      let player
      if (existingPlayer) {
        player = await client.mutation(api.players.updatePlayer, {
          player_id,
          new_player_name: body.player_name
        })
        await client.mutation(api.history.updateTodayHistoriesPlayerName, {
          player_id,
          new_player_name: body.player_name
        })
      } else {
        player = await client.mutation(api.players.createPlayer, {
          player_id,
          player_name: body.player_name
        })
      }

      return json(player)
    } catch (error) {
      console.error('[Player Registration Error]:', error)
      return json(
        { error: 'Internal server error occurred' },
        { status: 500 }
      )
    }
  },
})
