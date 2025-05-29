// context/GameContext.tsx
import { players as initialPlayers } from "@/data/players";
import { rooms as initialRooms } from "@/data/rooms";
import { Player, Room } from "@/types/types";
import React, { createContext, useContext, useState } from "react";

import { clueSets } from "@/data/clues";

type GameContextType = {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  rooms: Room[];
  currentPlayer: Player | null;
  selectPlayer: (id: string) => void;
  markRoomVisited: (roomId: string) => void;
  markChallengeSolved: (roomId: string) => void;
  getAttemptsForRoom: (playerId: string, roomId: string) => number;
  incrementAttemptsForRoom: (playerId: string, roomId: string) => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameAttempts, setGameAttempts] = useState<{
    [playerId: string]: { [roomId: string]: number };
  }>({});

  const selectPlayer = (id: string) => {
    const player = players.find((p) => p.id === id) || null;
    setCurrentPlayer(player);
  };

  const resetGame = () => {
    setPlayers(
      initialPlayers.map((p) => ({
        ...p,
        roomsVisited: [],
        challengesSolved: [],
        secretGoal: null,
      }))
    );
    setRooms(
      initialRooms.map((r) => ({
        ...r,
        unlocked: false,
      }))
    );
    setGameAttempts({});
    setCurrentPlayer(null);
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

  const assignClues = () => {
    const shuffled = [...clueSets].sort(() => Math.random() - 0.5);
    setPlayers((prev) =>
      prev.map((player, i) => ({
        ...player,
        secretGoal: shuffled[i],
      }))
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

  const incrementAttemptsForRoom = (playerId: string, roomId: string) => {
    setGameAttempts((prev) => {
      const current = prev[playerId]?.[roomId] ?? 0;
      return {
        ...prev,
        [playerId]: {
          ...prev[playerId],
          [roomId]: current + 1,
        },
      };
    });
  };

  const getAttemptsForRoom = (playerId: string, roomId: string) => {
    return gameAttempts[playerId]?.[roomId] ?? 0;
  };

  return (
    <GameContext.Provider
      value={{
        players,
        setPlayers, // <- add this line
        rooms,
        currentPlayer,
        selectPlayer,
        markRoomVisited,
        markChallengeSolved,
        getAttemptsForRoom,
        incrementAttemptsForRoom,
        resetGame,
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
