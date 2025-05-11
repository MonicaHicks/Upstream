// types/types.ts

export type Player = {
  id: string;
  name: string;
  color: string;
  roomsVisited: string[];
  challengesSolved: string[];
};

export type Room = {
  id: string;
  name: string;
  color: string;
  unlocked: boolean;
};
