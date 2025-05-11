import { useGame } from "@/context/GameContext";
import { roomRiddlesWithAnswers } from "@/data/roomRiddlesWithAnswers";
import { checkAnswer } from "@/utils/checkAnswer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { rooms, currentPlayer, markRoomVisited, markChallengeSolved } =
    useGame();
  const router = useRouter();

  const room = rooms.find((r) => r.id === roomId);
  const riddles =
    roomId &&
    roomRiddlesWithAnswers[roomId as keyof typeof roomRiddlesWithAnswers];
  const riddle = riddles?.[0] as { question: string; answer: string };

  const [input, setInput] = useState("");
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState("");

  if (!room || !currentPlayer || !riddle) {
    return (
      <View style={styles.center}>
        <Text>Something went fishy 🐡</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    const correct = checkAnswer(input, riddle.answer);
    if (correct) {
      markRoomVisited(room.id);
      markChallengeSolved(room.id);
      setSolved(true);
      setFeedback("✅ Correct!");
    } else {
      setFeedback("❌ Try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: room.color }]}>
      <Text style={styles.header}>{room.name}</Text>
      <Text style={styles.subtext}>
        Solving as:{" "}
        <Text style={{ fontWeight: "bold" }}>{currentPlayer.name}</Text>
      </Text>

      <View style={styles.riddleBox}>
        <Text style={styles.riddleText}>{riddle.question}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your answer..."
          value={input}
          onChangeText={setInput}
          editable={!solved}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.button}
          disabled={solved}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        {feedback !== "" && <Text style={styles.feedback}>{feedback}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 32, fontWeight: "bold", textAlign: "center" },
  subtext: { textAlign: "center", marginBottom: 24 },
  riddleBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  riddleText: { fontSize: 18, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: { backgroundColor: "#222", padding: 12, borderRadius: 8 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  feedback: { marginTop: 12, fontSize: 16, textAlign: "center" },
});
