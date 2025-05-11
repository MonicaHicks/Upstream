// context/GameContext.tsx

import { players as initialPlayers } from "@/data/players";
import { rooms as initialRooms } from "@/data/rooms";
import { Player, Room } from "@/types/types";
import React, { createContext, useContext, useState } from "react";

type GameContextType = {
  players: Player[];
  rooms: Room[];
  currentPlayer: Player | null;
  selectPlayer: (id: string) => void;
  markRoomVisited: (roomId: string) => void;
  markChallengeSolved: (roomId: string) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const selectPlayer = (id: string) => {
    const player = players.find((p) => p.id === id) || null;
    setCurrentPlayer(player);
  };

  const markRoomVisited = (roomId: string) => {
    if (!currentPlayer) return;
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === currentPlayer.id && !p.roomsVisited.includes(roomId)
          ? { ...p, roomsVisited: [...p.roomsVisited, roomId] }
          : p
      )
    );
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, unlocked: true } : r))
    );
  };

  const markChallengeSolved = (roomId: string) => {
    if (!currentPlayer) return;

    // Check if any player already solved it
    const alreadySolved = players.some((p) =>
      p.challengesSolved.includes(roomId)
    );
    if (alreadySolved) return;

    // Give credit to the current player
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === currentPlayer.id
          ? { ...p, challengesSolved: [...p.challengesSolved, roomId] }
          : p
      )
    );
  };

  return (
    <GameContext.Provider
      value={{
        players,
        rooms,
        currentPlayer,
        selectPlayer,
        markRoomVisited,
        markChallengeSolved,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
};
