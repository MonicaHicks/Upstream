import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GamePopupModal from "./GamePopUpModal";

const fishImages = [
  require("../assets/images/group1.png"),
  require("../assets/images/group2.png"),
  require("../assets/images/group3.png"),
  require("../assets/images/group4.png"),
  require("../assets/images/group5.png"),
  require("../assets/images/group6.png"),
  require("../assets/images/group7.png"),
  require("../assets/images/group8.png"),
];

const WORDS = ["PENCIL", "PAPER", "RULER", "MARKER", "CRAYON", "WASHI"];

export default function HangmanGame({ onWin, onFail }) {
  const router = useRouter();
  const [word] = useState(WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guessed, setGuessed] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(7);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [step, setStep] = useState("intro"); // now includes rules
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    if (step === "game" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsCorrect(false);
      setStep("done");
    }
  }, [timeLeft, step]);

  const maskedWord = word
    .split("")
    .map((letter) => (guessed.includes(letter) ? letter : "_"))
    .join(" ");

  const handleGuess = (input) => {
    const upper = input.toUpperCase();
    if (guessed.includes(upper) || wrongLetters.includes(upper)) return;

    if (word.includes(upper)) {
      const newGuessed = [...guessed, upper];
      setGuessed(newGuessed);
      if (word.split("").every((l) => newGuessed.includes(l))) {
        setIsCorrect(true);
        setStep("done");
      }
    } else {
      const newWrong = [...wrongLetters, upper];
      const remaining = attemptsLeft - 1;
      setWrongLetters(newWrong);
      setAttemptsLeft(remaining);
      if (remaining <= 0) {
        setIsCorrect(false);
        setStep("done");
      }
    }
    setError("");
  };

  const handleBackToMap = () => {
    if (isCorrect) {
      onWin();
    } else {
      onFail();
    }
    router.back();
  };

  return (
    <>
      {/* Intro modal */}
      <GamePopupModal
        visible={step === "intro"}
        imageSrc={require("../assets/images/shopowners/happystationery.png")}
        message={
          "Welcome to the Stationery Shop!\n\nYou're in luck, we just got new pens.\n\nCare to quality-test them with some hangfish?"
        }
        onClose={() => setStep("rules")}
        buttonText="Next"
      />

      {/* Rules modal */}
      <GamePopupModal
        visible={step === "rules"}
        imageSrc={require("../assets/images/shopowners/happystationery.png")}
        message={
          "Tap on a button to guess a letter. You have 7 guesses and 60 seconds.\nEach wrong guess brings the fish closer to death.\n\nCan you guess the word in time?"
        }
        onClose={() => setStep("game")}
        buttonText="Start Game"
      />

      {/* End modal */}
      <GamePopupModal
        visible={step === "done"}
        imageSrc={
          isCorrect
            ? require("../assets/images/shopowners/happystationery.png")
            : require("../assets/images/shopowners/sadstationery.png")
        }
        message={
          isCorrect
            ? "🎉 You saved the stationery!\nSharp thinking!"
            : `🫣 The fish DIED...\nThe word was: ${word}`
        }
        onClose={handleBackToMap}
        buttonText="Back to Map"
      />

      {step === "game" && (
        <ImageBackground
          source={require("../assets/images/statbg.png")}
          style={styles.background}
        >
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>⏳ {timeLeft}s</Text>
          </View>

          <View style={styles.notepadWrapper}>
            <Image
              source={require("../assets/images/notepad.png")}
              style={styles.notepad}
            />
            <Image
              source={fishImages[wrongLetters.length]}
              style={styles.fishImage}
            />
            <Text style={styles.word} numberOfLines={1} adjustsFontSizeToFit>
              {maskedWord}
            </Text>
          </View>

          <View style={styles.livesContainer}>
            <Text style={styles.livesText}>
              Lives Remaining: {attemptsLeft}
            </Text>
          </View>

          {error !== "" && <Text style={styles.error}>{error}</Text>}

          <View style={styles.keyboard}>
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
              const guessedAlready =
                guessed.includes(letter) || wrongLetters.includes(letter);
              return (
                <TouchableOpacity
                  key={letter}
                  onPress={() => handleGuess(letter)}
                  disabled={guessedAlready}
                  style={[styles.key, guessedAlready && styles.keyUsed]}
                >
                  <Text
                    style={[
                      styles.keyText,
                      guessedAlready && styles.keyTextUsed,
                    ]}
                  >
                    {letter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ImageBackground>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    paddingTop: 60,
  },
  timerContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
  },
  notepadWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 4,
  },
  notepad: {
    width: 280,
    height: 350,
    resizeMode: "contain",
  },
  fishImage: {
    position: "absolute",
    top: 50,
    width: 230,
    height: 230,
    resizeMode: "contain",
  },
  word: {
    position: "absolute",
    bottom: 60,
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 12,
    color: "black",
    maxWidth: 240,
    textAlign: "center",
  },
  livesContainer: {
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginTop: 10,
    marginBottom: 10,
  },
  livesText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 320,
    marginTop: 10,
  },
  key: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    margin: 4,
    borderRadius: 20,
  },
  keyUsed: {
    backgroundColor: "#ffdede",
  },
  keyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  keyTextUsed: {
    color: "#cc4444",
  },
});
