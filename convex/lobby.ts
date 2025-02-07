import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import {
  newLobbySchema,
  updateLobbySchema,
  deleteLobbySchema,
} from './schema'

// Query Handlers

export const getLobbies = query({
  args: {},
  handler: async (ctx) => {
    const lobbies = await ctx.db.query('lobbies').collect()
    return lobbies
  },
})

export const getLobby = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const lobby = await ctx.db
      .query('lobbies')
      .filter((q) => q.eq(q.field('id'), args.id))
      .first()
    return lobby
  },
})

// Mutation Handlers

export const createLobby = mutation({
  args: newLobbySchema,
  handler: async (ctx, args) => {
    const lobbyId = await ctx.db.insert('lobbies', {
      id: args.id,
      player_count: args.player_count,
      max_players: args.max_players,
    })
    return lobbyId
  },
})

export const updateLobby = mutation({
  args: updateLobbySchema,
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args
    const existingLobby = await ctx.db
      .query('lobbies')
      .filter((q) => q.eq(q.field('id'), id))
      .first()

    if (!existingLobby) {
      throw new Error(`Lobby with id ${id} not found`)
    }

    await ctx.db.patch(existingLobby._id, updateFields)
    return existingLobby._id
  },
})

export const deleteLobby = mutation({
  args: deleteLobbySchema,
  handler: async (ctx, args) => {
    const existingLobby = await ctx.db
      .query('lobbies')
      .filter((q) => q.eq(q.field('id'), args.id))
      .first()

    if (!existingLobby) {
      throw new Error(`Lobby with id ${args.id} not found`)
    }

    await ctx.db.delete(existingLobby._id)
    return existingLobby._id
  },
}) 