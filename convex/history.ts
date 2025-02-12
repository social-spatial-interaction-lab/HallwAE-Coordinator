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
