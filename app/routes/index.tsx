import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "~/components/Loader";

export const Route = createFileRoute("/")({
  component: Home,
  pendingComponent: () => <Loader />,
});

function Home() {

  return (
    <div className="p-8 space-y-2">
      <h1 className="text-2xl font-black">HallwAE!!</h1>
    </div>
  );
}
