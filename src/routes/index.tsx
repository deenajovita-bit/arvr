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
      <main className="flex min-h-dvh items-center justify-center bg-[#0c0b0a] text-[#e8e2d6]">
        <p className="font-[Cormorant_Garamond,serif] text-3xl tracking-[-0.03em]">Augmented Alibi</p>
      </main>
    );
  }
  return <client.GameClient />;
}
