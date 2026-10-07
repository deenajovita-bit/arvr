import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [client, setClient] = useState<null | typeof import("@/game/GameClient")>(null);
  useEffect(() => {
    void import("@/game/GameClient").then(setClient);
  }, []);

  if (!client) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-[color:var(--color-bg)] text-[color:var(--color-fg)]">
        <p className="kicker">Metropolitan Bureau</p>
        <p className="font-display mt-3 text-4xl tracking-[-0.03em]">Opening the file</p>
      </main>
    );
  }
  return <client.GameClient />;
}
