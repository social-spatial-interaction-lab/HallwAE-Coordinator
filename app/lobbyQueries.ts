import { useMutation } from '@tanstack/react-query'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { api } from '../convex/_generated/api'

export const lobbyQueries = {
  // Get all lobbies
  list: () => convexQuery(api.lobby.getLobbies, {}),
  // Get a specific lobby by ID
  detail: (id: string) => convexQuery(api.lobby.getLobby, { id }),
  getAvailableLobby: () => convexQuery(api.lobby.getAvailableLobby, {}),
  validateCreationToken: (token: number) => 
    convexQuery(api.lobby.validateCreationToken, { token }),
}

export function useCreateLobbyMutation() {
  const mutationFn = useConvexMutation(api.lobby.createLobby)
  return useMutation({ mutationFn })
}

export function useUpdateLobbyMutation() {
  const mutationFn = useConvexMutation(
    api.lobby.updateLobby,
  ).withOptimisticUpdate((localStore, args) => {
    const lobby = localStore.getQuery(api.lobby.getLobby, { id: args.id })
    if (!lobby) return

    const updatedLobby = {
      ...lobby,
      ...args,
    }

    localStore.setQuery(api.lobby.getLobby, { id: args.id }, updatedLobby)
  })

  return useMutation({ mutationFn })
}

export function useDeleteLobbyMutation() {
  const mutationFn = useConvexMutation(
    api.lobby.deleteLobby,
  ).withOptimisticUpdate((localStore, args) => {
    localStore.setQuery(api.lobby.getLobby, { id: args.id }, null)
  })

  return useMutation({ mutationFn })
}

// History related queries
export const historyQueries = {
  // Get all histories for a specific lobby
  listByLobby: (lobbyId: string) => convexQuery(api.history.getHistoriesByLobby, { lobbyId }),
  // Get all histories for a specific player
  listByPlayer: (playerId: string) => convexQuery(api.history.getHistoriesByPlayer, { playerId }),
}

export function useCreateHistoryMutation() {
  const mutationFn = useConvexMutation(api.history.createHistory)
  return useMutation({ mutationFn })
}

export function useJoinLobbyMutation() {
  const mutationFn = useConvexMutation(
    api.lobby.joinLobby,
  ).withOptimisticUpdate((localStore, args) => {
    const lobby = localStore.getQuery(api.lobby.getLobby, { id: args.lobby_id })
    if (!lobby) return

    const updatedLobby = {
      ...lobby,
      player_count: lobby.player_count + 1
    }

    localStore.setQuery(api.lobby.getLobby, { id: args.lobby_id }, updatedLobby)
  })

  return useMutation({ mutationFn })
}

export function useHandleCreationLockMutation() {
  const mutationFn = useConvexMutation(api.lobby.handleCreationLock)
  return useMutation({ mutationFn })
} 