// app/layout.tsx

import { GameProvider } from "@/context/GameContext";
import { Slot } from "expo-router";

export default function Layout() {
  return (
    <GameProvider>
      <Slot />
    </GameProvider>
  );
}
