import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const createPlayer = mutation({
  args: {
    player_id: v.string(),
    player_name: v.string()
  },
  async handler(ctx, args) {
    // Check if player already exists
    const existingPlayer = await ctx.db
      .query('players')
      .withIndex('player_id', (q) => q.eq('player_id', args.player_id))
      .unique()

    if (existingPlayer) {
      await ctx.db.patch(existingPlayer._id, {
        player_name: args.player_name,
      })

      // Get the updated player data after the patch
      const updatedPlayer = await ctx.db.get(existingPlayer._id)
      return updatedPlayer
    }

    // Create new player
    const player = await ctx.db.insert('players', {
      player_id: args.player_id,
      player_name: args.player_name,
    })

    return player
  },
}) 
