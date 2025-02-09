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
      .withIndex('id', (q) => q.eq('id', args.id))
      .unique()
    return lobby
  },
})

export const getAvailableLobby = query({
  handler: async (ctx) => {
    return await ctx.db.query('lobbies')
      .filter(q => q.eq(q.field('player_count'), q.field('max_players')))
      .first()
  }
})

// Mutation Handlers

export const createLobby = mutation({
  args: newLobbySchema,
  handler: async (ctx, args) => {
    const lobbyId = await ctx.db.insert('lobbies', {
      id: args.id,
      creator_id: args.creator_id,
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
      .withIndex('id', (q) => q.eq('id', args.id))
      .unique()

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
      .withIndex('id', (q) => q.eq('id', args.id))
      .unique()

    if (!existingLobby) {
      throw new Error(`Lobby with id ${args.id} not found`)
    }

    await ctx.db.delete(existingLobby._id)
    return existingLobby._id
  },
})

export const joinLobby = mutation({
  args: { lobby_id: v.string(), playerId: v.string() },
  handler: async (ctx, args) => {
    const lobby = await ctx.db
      .query('lobbies')
      .withIndex("id", q => q.eq("id", args.lobby_id))
      .unique()
    if (!lobby) throw new Error('Lobby not found')

    await ctx.db.patch(lobby._id, {
      player_count: lobby.player_count + 1
    })
  }
})

export const exitLobby = mutation({
  args: { lobby_id: v.string(), playerId: v.string() },
  handler: async (ctx, args) => {
    const lobby = await ctx.db
      .query('lobbies')
      .withIndex("id", q => q.eq("id", args.lobby_id))
      .unique()

    if (!lobby) throw new Error('Lobby not found')

    await ctx.db.patch(lobby._id, {
      player_count: lobby.player_count - 1
    })
  }
})

export const handleCreationLock = mutation({
  handler: async (ctx) => {
    const lock = await ctx.db.query('creation_locks').first()
    const now = Date.now()

    if (lock && now < lock.expiresAt) {
      return { token: lock.token }
    }

    const newToken = Math.floor(now / 1000)
    await ctx.db.insert('creation_locks', {
      token: newToken,
      expiresAt: now + 5000
    })

    return { token: newToken }
  }
})

export const validateCreationToken = query({
  args: { token: v.number() },
  handler: async (ctx, args) => {
    const lock = await ctx.db.query('creation_locks')
      .filter(q => q.eq(q.field('token'), args.token))
      .first()

    return !!lock && Date.now() < lock.expiresAt
  }
})

