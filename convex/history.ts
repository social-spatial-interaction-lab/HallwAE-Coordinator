import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { newHistorySchema } from './schema'

// Query Handlers

export const getAllHistories = query({
  args: {},
  handler: async (ctx) => {
    const histories = await ctx.db.query('histories').collect()
    return histories
  },
})

export const getHistoriesByLobby = query({
  args: { lobbyId: v.string() },
  handler: async (ctx, args) => {
    const histories = await ctx.db
      .query('histories')
      .withIndex('lobby', (q) => q.eq('lobby_id', args.lobbyId))
      .collect()
    return histories
  },
})

export const getHistoriesByPlayer = query({
  args: { playerId: v.string() },
  handler: async (ctx, args) => {
    const histories = await ctx.db
      .query('histories')
      .withIndex('player', (q) => q.eq('player_id', args.playerId))
      .collect()
    return histories
  },
})

export const updateTodayHistoriesPlayerName = mutation({
  args: {
    player_id: v.string(),
    new_player_name: v.string(),
  },
  handler: async (ctx, args) => {
    // Get today's start timestamp (midnight)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Find all histories for this player from today
    const todayHistories = await ctx.db
      .query('histories')
      .withIndex('player', (q) => q.eq('player_id', args.player_id))
      .filter((q) => q.gte(q.field('_creationTime'), today.getTime()))
      .collect()

    // Update each history's player_name
    for (const history of todayHistories) {
      await ctx.db.patch(history._id, {
        player_name: args.new_player_name,
      })
    }

    return todayHistories.length // Return number of updated records
  },
})

export const createHistory = mutation({
  args: newHistorySchema,
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query('players')
      .withIndex('player_id', (q) => q.eq('player_id', args.player_id))
      .unique()
    if (!player) {
      throw new Error('Player not found')
    }

    const historyId = await ctx.db.insert('histories', {
      lobby_id: args.lobby_id,
      player_id: args.player_id,
      player_name: player.player_name,
      action_type: args.action_type,
    })
    return historyId
  },
})


