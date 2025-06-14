// types/types.ts

export type Player = {
  id: string;
  name: string;
  color: string;
  roomsVisited: string[];
  challengesSolved: string[];
  secretGoal: { clue: string; rooms: string[] } | null; // allow null
};

export type Room = {
  id: string;
  name: string;
  color: string;
  unlocked: boolean;
  image: any;
  happyfish: any;
  sadfish: any;
};
