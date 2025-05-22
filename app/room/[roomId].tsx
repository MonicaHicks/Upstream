import BakeryGame from "@/components/BakeryGame";
import GamblingGame from "@/components/GamblingGame";
import OpenUpShop from "@/components/OpenUpShop";
import TarotGame from "@/components/TarotGame";
import { useGame } from "@/context/GameContext";
import { roomRiddlesWithAnswers } from "@/data/roomRiddlesWithAnswers";
import { checkAnswer } from "@/utils/checkAnswer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
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

  if (!room || !currentPlayer) {
    return (
      <View style={styles.center}>
        <Text>Something went fishy 🐡</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    const correct = riddle && checkAnswer(input, riddle.answer);
    if (correct) {
      markRoomVisited(room.id);
      markChallengeSolved(room.id);
      setSolved(true);
      setFeedback("✅ Correct!");
    } else {
      setFeedback("❌ Try again.");
    }
  };

  const handleGamblingWin = () => {
    markRoomVisited(room.id);
    markChallengeSolved(room.id);
    setSolved(true);
    setFeedback("Gambling Ace!");
  };

  const handleOpenUpShopWin = () => {
    markRoomVisited(room.id);
    markChallengeSolved(room.id);
    setSolved(true);
    setFeedback("You're ready to open!");
  };

  const handleBakeryWin = () => {
    markRoomVisited(room.id);
    markChallengeSolved(room.id);
    setSolved(true);
    setFeedback("Pro Baker!");
  };

  const handleTarotWin = () => {
    markRoomVisited(room.id);
    markChallengeSolved(room.id);
    setSolved(true);
    setFeedback("Tarot Master!");
  };

  return (
    <ImageBackground
      source={room.image}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>{room.name}</Text>
        <Text style={styles.subtext}>
          Solving as:{" "}
          <Text style={{ fontWeight: "bold" }}>{currentPlayer.name}</Text>
        </Text>

        <View style={styles.riddleBox}>
          {room.id === "gambling-den" ? (
            <>
              <GamblingGame onWin={handleGamblingWin} />
              {feedback !== "" && (
                <Text style={styles.feedback}>{feedback}</Text>
              )}
            </>
          ) : room.id === "bakery" ? (
            <>
              <BakeryGame onWin={handleBakeryWin} />
              {feedback !== "" && (
                <Text style={styles.feedback}>{feedback}</Text>
              )}
            </>
          ) : room.id === "open-up-shop" ? (
            <>
              <OpenUpShop onWin={handleOpenUpShopWin} />
              {feedback !== "" && (
                <Text style={styles.feedback}>{feedback}</Text>
              )}
            </>
          ) : room.id === "tarot" ? (
            <>
              <TarotGame onWin={handleTarotWin} />
              {feedback !== "" && (
                <Text style={styles.feedback}>{feedback}</Text>
              )}
            </>
          ) : riddle ? (
            <>
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
              {feedback !== "" && (
                <Text style={styles.feedback}>{feedback}</Text>
              )}
            </>
          ) : (
            <Text>No puzzle found for this room.</Text>
          )}

          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.button, { marginTop: 12, backgroundColor: "#888" }]}
          >
            <Text style={styles.buttonText}>Back to Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginTop: 50,
  },
  subtext: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 24,
    color: "white",
  },
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
  background: {
    flex: 1,
    justifyContent: "center",
  },

  overlay: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: "rgba(0,0,0,0.4)", // dim background slightly for readability
  },
});
