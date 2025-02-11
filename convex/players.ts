import { mutation } from './_generated/server'
import { v } from 'convex/values'
import { faker } from '@faker-js/faker'

export const createPlayer = mutation({
  args: {
    player_id: v.string(),
  },
  async handler(ctx, args) {
    // Check if player already exists
    const existingPlayer = await ctx.db
      .query('players')
      .withIndex('player_id', (q) => q.eq('player_id', args.player_id))
      .unique()

    if (existingPlayer) {
      return existingPlayer
    }

    // Generate a random player name using Faker
    const player_name = faker.internet.userName()

    // Create new player
    const player = await ctx.db.insert('players', {
      player_id: args.player_id,
      player_name,
    })

    return player
  },
}) 