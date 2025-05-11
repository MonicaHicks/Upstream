// app/room/[roomId].tsx

import { useGame } from "@/context/GameContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { rooms, currentPlayer, markRoomVisited, markChallengeSolved } =
    useGame();
  const router = useRouter();

  const room = rooms.find((r) => r.id === roomId);

  if (!room || !currentPlayer) {
    return (
      <View style={styles.center}>
        <Text>Something went fishy 🐡</Text>
      </View>
    );
  }

  const handleSolve = () => {
    markRoomVisited(room.id);
    markChallengeSolved(room.id);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: room.color }]}>
      <Text style={styles.header}>{room.name}</Text>
      <Text style={styles.subtext}>
        Solved by:{" "}
        <Text style={{ fontWeight: "bold" }}>{currentPlayer.name}</Text>
      </Text>

      <View style={styles.puzzleBox}>
        <Text style={styles.puzzleText}>🧩 [Insert puzzle or riddle here]</Text>
      </View>

      <TouchableOpacity onPress={handleSolve} style={styles.solveButton}>
        <Text style={styles.solveText}>Mark Puzzle as Solved</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtext: {
    textAlign: "center",
    marginBottom: 32,
    fontSize: 16,
  },
  puzzleBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  puzzleText: {
    fontSize: 18,
    textAlign: "center",
  },
  solveButton: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 10,
  },
  solveText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
