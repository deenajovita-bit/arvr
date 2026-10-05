import { Investigation } from "@/game/Investigation";
import { Briefing, Menu, PlayHud, Result } from "@/game/Hud";
import { useGame } from "@/game/store";

export function GameClient() {
  const screen = useGame((s) => s.screen);
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[color:var(--color-bg)] text-[color:var(--color-fg)]">
      <Investigation playing={screen === "play"} />
      {screen === "menu" && <Menu />}
      {screen === "briefing" && <Briefing />}
      {screen === "play" && <PlayHud />}
      {screen === "result" && <Result />}
    </main>
  );
}
