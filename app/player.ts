import { api } from '~/../convex/_generated/api'
import { client } from '~/sharedConvex'

export const createOrUpdatePlayer = async (player_id: string, player_name: string) => {
  // Check if player exists
  const existingPlayer = await client.query(api.players.getPlayer, {
    id: player_id
  })

  // Use appropriate mutation based on whether player exists
  let player
  if (existingPlayer) {
    player = await client.mutation(api.players.updatePlayer, {
      player_id,
      new_player_name: player_name
    })
    await client.mutation(api.history.updateTodayHistoriesPlayerName, {
      player_id,
      new_player_name: player_name
    })
  } else {
    player = await client.mutation(api.players.createPlayer, {
      player_id,
      player_name
    })
  }
  return player
}
