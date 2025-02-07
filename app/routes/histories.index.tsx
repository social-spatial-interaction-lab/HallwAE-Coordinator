import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/histories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/histories/"!</div>
}
