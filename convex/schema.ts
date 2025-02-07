import { defineSchema, defineTable } from 'convex/server'
import { type Infer, v } from 'convex/values'

// TODO: will player_id be static for each devices? we can manually set username in the database.
const schema = defineSchema({
  lobbies: defineTable({
    id: v.string(),
    player_count: v.number(),
    max_players: v.number(),
  }).index('id', ['id']),

  histories: defineTable({
    id: v.string(),
    lobby_id: v.string(),
    player_id: v.string(),
    // 'join' or 'leave'
    action_type: v.string(),
  })
    .index('id', ['id'])
    .index('lobby', ['lobby_id'])
    .index('player', ['player_id']),

  boards: defineTable({
    id: v.string(),
    name: v.string(),
    color: v.string(),
  }).index('id', ['id']),

  columns: defineTable({
    id: v.string(),
    boardId: v.string(),
    name: v.string(),
    order: v.number(),
  })
    .index('id', ['id'])
    .index('board', ['boardId']),

  items: defineTable({
    id: v.string(),
    title: v.string(),
    content: v.optional(v.string()),
    order: v.number(),
    columnId: v.string(),
    boardId: v.string(),
  })
    .index('id', ['id'])
    .index('column', ['columnId'])
    .index('board', ['boardId']),

  creation_locks: defineTable({
    token: v.number(),
    expiresAt: v.number()
  })
})
export default schema

const board = schema.tables.boards.validator
const column = schema.tables.columns.validator
const item = schema.tables.items.validator
const lobby = schema.tables.lobbies.validator
const history = schema.tables.histories.validator

export const updateBoardSchema = v.object({
  id: board.fields.id,
  name: v.optional(board.fields.name),
  color: v.optional(v.string()),
})

export const updateColumnSchema = v.object({
  id: column.fields.id,
  boardId: column.fields.boardId,
  name: v.optional(column.fields.name),
  order: v.optional(column.fields.order),
})

export const deleteItemSchema = v.object({
  id: item.fields.id,
  boardId: item.fields.boardId,
})
const { order, id, ...rest } = column.fields
export const newColumnsSchema = v.object(rest)
export const deleteColumnSchema = v.object({
  boardId: column.fields.boardId,
  id: column.fields.id,
})

export const newLobbySchema = v.object(lobby.fields)
export const updateLobbySchema = v.object({
  id: lobby.fields.id,
  player_count: lobby.fields.player_count,
  max_players: lobby.fields.max_players,
})
export const deleteLobbySchema = v.object({
  id: column.fields.id,
})

export const newHistorySchema = v.object(history.fields)

export type Board = Infer<typeof board>
export type Column = Infer<typeof column>
export type Item = Infer<typeof item>
export type Lobby = Infer<typeof lobby>

