import { useGame } from "@/context/GameContext";
import { rooms } from "@/data/rooms";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

type Props = {
  onWin: () => void;
};

export default function OpenUpShop({ onWin }: Props) {
  const { currentPlayer } = useGame();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [attempts, setAttempts] = useState<
    { rooms: string[]; result: string[] }[]
  >([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const secretRooms = currentPlayer?.secretGoal?.rooms || [];

  const toggleRoom = (roomId: string) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter((r) => r !== roomId));
    } else if (selectedRooms.length < 3) {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const handleGuess = () => {
    if (!currentPlayer || selectedRooms.length !== 3) return;

    const result = selectedRooms.map((r, i) => {
      if (r === secretRooms[i]) return "🟩";
      if (secretRooms.includes(r)) return "🟨";
      return "⬜";
    });

    const newAttempts = [...attempts, { rooms: selectedRooms, result }];
    setAttempts(newAttempts);
    setSelectedRooms([]);

    // 🎉 Check for win
    if (result.every((symbol) => symbol === "🟩")) {
      setShowConfetti(true);
      onWin(); // Callback to parent
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Guess Your Rooms</Text>
      <Text style={styles.title}>
        Your Clue Is: {currentPlayer?.secretGoal.clue}
      </Text>

      <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 6 }}>
        {rooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            onPress={() => toggleRoom(room.id)}
            style={{
              padding: 10,
              margin: 4,
              borderRadius: 8,
              backgroundColor: selectedRooms.includes(room.id)
                ? "#4A90E2"
                : "#ccc",
            }}
          >
            <Text>{room.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitle}>
        Selected:{" "}
        {selectedRooms
          .map((id) => rooms.find((r) => r.id === id)?.name)
          .join(", ")}
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          { opacity: selectedRooms.length === 3 ? 1 : 0.4 },
        ]}
        disabled={selectedRooms.length !== 3}
        onPress={handleGuess}
      >
        <Text style={styles.buttonText}>Check</Text>
      </TouchableOpacity>

      {attempts.map((attempt, i) => (
        <View key={i} style={styles.row}>
          {attempt.rooms.map((roomId, j) => {
            const roomName = rooms.find((r) => r.id === roomId)?.name || roomId;
            return (
              <View key={j} style={styles.box}>
                <Text style={styles.boxText}>{roomName}</Text>
                <Text style={styles.feedback}>{attempt.result[j]}</Text>
              </View>
            );
          })}
        </View>
      ))}

      {showConfetti && (
        <ConfettiCannon
          count={80}
          origin={{ x: 200, y: -20 }}
          explosionSpeed={350}
          fadeOut
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center", color: "#666" },
  button: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: { color: "white", fontWeight: "bold", textAlign: "center" },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  box: { alignItems: "center", padding: 6 },
  boxText: { fontSize: 14, fontWeight: "bold" },
  feedback: { fontSize: 24 },
});
