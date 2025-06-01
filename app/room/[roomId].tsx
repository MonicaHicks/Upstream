// Full updated RoomScreen.tsx
import Anagram from "@/components/Anagram";
import BakeryGame from "@/components/BakeryGame";
import BoutiqueGame from "@/components/BoutiqueGame";
import GamblingGame from "@/components/GamblingGame";
import HairSalonGame from "@/components/HairSalonGame";
import HangmanGame from "@/components/HangmanGame";
import HatGame from "@/components/HatGame";
import KelpSnake from "@/components/KelpSnake";
import MuseumGame from "@/components/MuseumGame";
import OpenUpShop from "@/components/OpenUpShop";
import TarotGame from "@/components/TarotGame";
import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";

import { useGame } from "@/context/GameContext";
import { roomRiddlesWithAnswers } from "@/data/roomRiddlesWithAnswers";
import { checkAnswer } from "@/utils/checkAnswer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
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
  const {
    rooms,
    currentPlayer,
    markRoomVisited,
    markChallengeSolved,
    getAttemptsForRoom,
    incrementAttemptsForRoom,
  } = useGame();
  const router = useRouter();
  const [randomIndex, setRandomIndex] = useState(0);
  let [fontsLoaded] = useFonts({
    Cinzel_900Black,
  });

  const room = rooms.find((r) => r.id === roomId);
  const riddles =
    roomId &&
    roomRiddlesWithAnswers[roomId as keyof typeof roomRiddlesWithAnswers];
  const riddle = riddles?.[randomIndex] as { question: string; answer: string };

  const [input, setInput] = useState("");
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [chosenMode, setChosenMode] = useState<"riddle" | "game" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [won, setWon] = useState<boolean | null>(null);

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
    setWon(true);
    setShowResult(true);
  };

  const handleGameFail = (msg: string) => {
    incrementAttemptsForRoom(currentPlayer.id, room.id);
    setWon(false);
    setShowResult(true);
  };

  const hasMiniGame = [
    "bakery",
    "gambling-den",
    "tarot",
    "open-up-shop",
    "stationary-shop",
    "fish-pub",
    "museum",
    "kelp-nursery",
    "hair-salon",
    "hat-store",
    "fish-fashion",
  ].includes(room.id);

  const hasRiddle = !!riddle;
  const attempts = getAttemptsForRoom(currentPlayer.id, room.id);
  const showChoice =
    hasMiniGame && hasRiddle && !solved && attempts < 2 && !chosenMode;
  useEffect(() => {
    if (!hasMiniGame && hasRiddle) {
      setChosenMode("riddle");
    } else if (hasMiniGame && (!hasRiddle || attempts < 2)) {
      setChosenMode("game");
    } else if (hasMiniGame && hasRiddle && attempts >= 2) {
      setChosenMode("riddle");
    }
    if (riddles && riddles.length > 0) {
      const index = Math.floor(Math.random() * riddles.length);
      setRandomIndex(index);
    }
  }, [roomId, attempts]);

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
                      fontFamily: "Cinzel_900Black",
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
                <GamblingGame
                  onWin={() => handleGameWin("Gambling Ace!")}
                  onFail={() => handleGameFail("Nice try!")}
                />
              )}
              {room.id === "bakery" && (
                <BakeryGame
                  onWin={() => handleGameWin("Pro Baker!")}
                  onFail={() => handleGameFail("Nice try!")}
                />
              )}
              {room.id === "tarot" && (
                <TarotGame
                  onWin={() => handleGameWin("Tarot Master!")}
                  onFail={() => handleGameFail("Nice try!")}
                />
              )}
              {room.id === "open-up-shop" && (
                <OpenUpShop
                  onWin={() => handleGameWin("You're ready to open!")}
                />
              )}
              {room.id === "stationary-shop" && (
                <HangmanGame
                  onWin={() => handleGameWin("Stationery Star!")}
                  onFail={() => handleGameFail("Nice try!")}
                />
              )}
              {room.id === "fish-pub" && (
                <Anagram
                  onWin={() =>
                    handleGameWin("You’re not too drunk to read!")
                  }
                  onFail={() => handleGameFail("Nice try!")}
                />
              )}
              {room.id === "museum" && (
                <MuseumGame
                  onWin={() => handleGameWin("Fossil Finder!")}
                  onFail={() => handleGameFail("Nice try!")}
                />
              )}
              {room.id === "hat-store" && (
                <HatGame
                  onWin={() => handleGameWin("Hat Master!")}
                  onFail={() => handleGameFail("Nice try!")}
                />
              )}
              {room.id === "kelp-nursery" && (
                <KelpSnake
                  onWin={() => handleGameWin("Green Thumb!")}
                  onFail={() => handleGameFail("Nice try!")}
                />
              )}
              {room.id === "hair-salon" && (
                <HairSalonGame
                  onWin={() => handleGameWin("Honey, you've got style!")}
                  onFail={() => handleGameFail("Nice try!")}
                />
              )}
              {room.id === "fish-fashion" && (
                <BoutiqueGame
                  onWin={() => handleGameWin("Fashion Icon!")}
                  onFail={() => handleGameFail("Nice try!")}
                />
              )}
            </>
          )}

          {showResult && (
            <Modal transparent animationType="fade" visible>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Image
                    source={won ? room.happyfish : room.sadfish}
                    style={{
                      width: 100,
                      height: 100,
                      marginBottom: 16,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: "center",
                      marginBottom: 16,
                      fontFamily: "Cinzel_900Black",
                    }}
                  >
                    {won ? "You did it!" : "Try again next time!"}
                  </Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setShowResult(false);
                      router.back();
                    }}
                  >
                    <Text style={styles.buttonText}>Back to Map</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

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
    fontFamily: "Cinzel_900Black",
  },
  subtext: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 24,
    color: "white",
    fontFamily: "Cinzel_900Black",
  },
  riddleBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  riddleText: {
    fontFamily: "Cinzel_900Black",
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontFamily: "Cinzel_900Black",
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
    fontFamily: "Cinzel_900Black",
  },
  feedback: {
    marginTop: 12,
    fontFamily: "Cinzel_900Black",
    fontSize: 16,
    textAlign: "center",
  },
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
