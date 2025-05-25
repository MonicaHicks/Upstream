// Full updated RoomScreen.tsx
import Anagram from "@/components/Anagram";
import BakeryGame from "@/components/BakeryGame";
import GamblingGame from "@/components/GamblingGame";
import HangmanGame from "@/components/HangmanGame";
import MuseumGame from "@/components/MuseumGame";
import OpenUpShop from "@/components/OpenUpShop";
import TarotGame from "@/components/TarotGame";

import { useGame } from "@/context/GameContext";
import { roomRiddlesWithAnswers } from "@/data/roomRiddlesWithAnswers";
import { checkAnswer } from "@/utils/checkAnswer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Modal,
  ScrollView,
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
  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    if (riddles && riddles.length > 0) {
      const index = Math.floor(Math.random() * riddles.length);
      setRandomIndex(index);
    }
  }, [roomId]); // ← reroll when roomId changes

  const room = rooms.find((r) => r.id === roomId);
  const riddles =
    roomId &&
    roomRiddlesWithAnswers[roomId as keyof typeof roomRiddlesWithAnswers];
  const riddle = riddles?.[randomIndex] as { question: string; answer: string };

  const [input, setInput] = useState("");
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [chosenMode, setChosenMode] = useState<"riddle" | "game" | null>(null);

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
      setFeedback("Correct!");
    } else {
      setFeedback("Try again.");
    }
  };

  const handleGameWin = (msg: string) => {
    markRoomVisited(room.id);
    markChallengeSolved(room.id);
    setSolved(true);
    setFeedback(msg);
  };

  const hasMiniGame = [
    "bakery",
    "gambling-den",
    "tarot",
    "open-up-shop",
    "stationary-shop",
    "fish-pub",
    "museum",
  ].includes(room.id);
  const hasRiddle = !!riddle;
  const showChoice = hasMiniGame && hasRiddle && !chosenMode && !solved;

  return (
    <ImageBackground
      source={room.image}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView style={styles.overlay}>
        <Text style={styles.header}>{room.name}</Text>
        <Text style={styles.subtext}>
          Solving as:{" "}
          <Text style={{ fontWeight: "bold" }}>{currentPlayer.name}</Text>
        </Text>

        <View style={styles.riddleBox}>
          {showChoice && (
            <Modal transparent visible animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text
                    style={{
                      fontSize: 24,
                      marginBottom: 16,
                      textAlign: "center",
                    }}
                  >
                    How do you want to play this room?
                  </Text>
                  <TouchableOpacity
                    style={[styles.button, { marginBottom: 10 }]}
                    onPress={() => setChosenMode("riddle")}
                  >
                    <Text style={styles.buttonText}>Solve Riddle</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setChosenMode("game")}
                  >
                    <Text style={styles.buttonText}>Play Mini Game</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          {!solved && (!hasMiniGame || chosenMode === "riddle") && riddle && (
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
            </>
          )}

          {((!solved && chosenMode === "game") || !hasRiddle) && (
            <>
              {room.id === "gambling-den" && (
                <GamblingGame onWin={() => handleGameWin("🎲 Gambling Ace!")} />
              )}
              {room.id === "bakery" && (
                <BakeryGame onWin={() => handleGameWin("🥖 Pro Baker!")} />
              )}
              {room.id === "tarot" && (
                <TarotGame onWin={() => handleGameWin("🔮 Tarot Master!")} />
              )}
              {room.id === "open-up-shop" && (
                <OpenUpShop
                  onWin={() => handleGameWin("🏪 You're ready to open!")}
                />
              )}
              {room.id === "stationary-shop" && (
                <HangmanGame
                  onWin={() => handleGameWin("🖊️ Stationery Star!")}
                />
              )}
              {room.id === "fish-pub" && (
                <Anagram
                  onWin={() =>
                    handleGameWin("🍻 You’re not too drunk to read!")
                  }
                />
              )}
              {room.id === "museum" && (
                <MuseumGame onWin={() => handleGameWin("🦴 Fossil Finder!")} />
              )}
            </>
          )}

          {feedback !== "" && <Text style={styles.feedback}>{feedback}</Text>}

          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.button, { marginTop: 12, backgroundColor: "#888" }]}
          >
            <Text style={styles.buttonText}>Back to Map</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
  riddleText: { fontSize: 18, marginBottom: 16, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  feedback: { marginTop: 12, fontSize: 16, textAlign: "center" },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
});
