import { defineSchema, defineTable } from 'convex/server'
import { type Infer, v } from 'convex/values'

const schema = defineSchema({
  players: defineTable({
    player_id: v.string(),
    player_name: v.string(),
  }).index('player_id', ['player_id']),

  lobbies: defineTable({
    id: v.string(),
    creator_id: v.string(),
    player_count: v.number(),
    max_players: v.number(),
  }).index('id', ['id']),

  histories: defineTable({
    lobby_id: v.string(),
    player_id: v.string(),
    // 'join' or 'leave'
    action_type: v.string(),
    player_name: v.string(),
  })
    .index('lobby', ['lobby_id'])
    .index('player', ['player_id']),

  creation_locks: defineTable({
    token: v.number(),
    expiresAt: v.number()
  })
})
export default schema

const lobby = schema.tables.lobbies.validator
const history = schema.tables.histories.validator
const player = schema.tables.players.validator

export const newLobbySchema = v.object(lobby.fields)
export const updateLobbySchema = v.object({
  id: lobby.fields.id,
  player_count: lobby.fields.player_count,
  max_players: lobby.fields.max_players,
})
export const deleteLobbySchema = v.object({
  id: lobby.fields.id,
})

const { player_name, ...player_rest } = history.fields
export const newHistorySchema = v.object(player_rest)

export type Lobby = Infer<typeof lobby>
export type History = Infer<typeof history>
export type Player = Infer<typeof player>
