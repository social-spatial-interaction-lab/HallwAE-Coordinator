import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  const histories = useQuery(api.history.getAllHistories)
  
  if (!histories) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Meeting History</h1>
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100">Lobby ID</th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100">Player Name</th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100">Action</th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100">Time</th>
          </tr>
        </thead>
        <tbody>
          {histories.map((history) => (
            <tr key={history._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200">{history.lobby_id}</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200">{history.player_name}</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200">{history.action_type}</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200">
                {new Date(history._creationTime).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
