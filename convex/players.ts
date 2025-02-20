import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getPlayer = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query('players')
      .withIndex('player_id', (q) => q.eq('player_id', args.id))
      .unique()

    return player
  },
})


export const updatePlayer = mutation({
  args: {
    player_id: v.string(),
    new_player_name: v.string()
  },
  async handler(ctx, args) {
    const existingPlayer = await ctx.db
      .query('players')
      .withIndex('player_id', (q) => q.eq('player_id', args.player_id))
      .unique()

    if (!existingPlayer) {
      throw new Error(`Player with id ${args.player_id} not found`)
    }

    if (existingPlayer.player_name === args.new_player_name) {
      return existingPlayer
    }

    await ctx.db.patch(existingPlayer._id, {
      player_name: args.new_player_name,
    })

    return await ctx.db.get(existingPlayer._id)
  },
})

export const createPlayer = mutation({
  args: {
    player_id: v.string(),
    player_name: v.string()
  },
  async handler(ctx, args) {
    const existingPlayer = await ctx.db
      .query('players')
      .withIndex('player_id', (q) => q.eq('player_id', args.player_id))
      .unique()

    if (existingPlayer) {
      throw new Error(`Player with id ${args.player_id} already exists`)
    }

    const id = await ctx.db.insert('players', {
      player_id: args.player_id,
      player_name: args.player_name,
    })

    return await ctx.db.get(id)
  },
})
