import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

const WORDS = [
  "PENCIL",
  "PAPER",
  "NOTEBOOK",
  "SHARPENER",
  "RULER",
  "MARKER",
  "CRAYON",
  "HIGHLIGHTER",
  "STICKERS",
  "WASHI",
  "JOURNAL",
];

type Props = {
  onWin: () => void;
};

export default function HangmanGame({ onWin }: Props) {
  const [word] = useState(WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [guess, setGuess] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(7);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [error, setError] = useState("");

  const maskedWord = word
    .split("")
    .map((letter) => (guessed.includes(letter) ? letter : "_"))
    .join(" ");

  const handleGuess = () => {
    const upper = guess.toUpperCase();

    if (!upper.match(/^[A-Z]$/)) {
      setError("Please enter a valid letter (A–Z).");
      return;
    }

    if (guessed.includes(upper) || wrongLetters.includes(upper)) {
      setError(`You already guessed "${upper}".`);
      return;
    }

    if (word.includes(upper)) {
      setGuessed([...guessed, upper]);
    } else {
      setWrongLetters([...wrongLetters, upper]);
      setAttemptsLeft(attemptsLeft - 1);
    }

    setGuess("");
    setError("");
  };

  const hasWon = word.split("").every((l) => guessed.includes(l));
  const hasLost = attemptsLeft <= 0;

  return (
    <View style={styles.container}>
      <View style={styles.fishContainer}>
        <Image
          source={fishImages[wrongLetters.length]}
          style={{ width: 200, height: 200, resizeMode: "contain" }}
        />
        <Text style={styles.word}>{maskedWord}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.attempts}>Attempts Left: {attemptsLeft}</Text>

        {!hasWon && !hasLost && (
          <>
            <TextInput
              value={guess}
              onChangeText={setGuess}
              maxLength={1}
              style={styles.input}
              autoCapitalize="characters"
            />
            <TouchableOpacity onPress={handleGuess} style={styles.guessButton}>
              <Text style={styles.guessButtonText}>Guess</Text>
            </TouchableOpacity>
          </>
        )}

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <View style={styles.usedBoxWrapper}>
          <Text style={styles.usedLabel}>Used Letters:</Text>
          <View style={styles.usedBox}>
            <Text>{wrongLetters.join(", ")}</Text>
          </View>
        </View>

        {hasWon && <Text style={styles.result}>🎉 You win!</Text>}
        {hasLost && (
          <Text style={styles.result}>💀 Game over. Word was {word}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffc6c6",
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  fishContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  word: {
    fontSize: 32,
    letterSpacing: 10,
    marginTop: 12,
    marginBottom: 24,
  },
  attempts: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: 60,
    height: 60,
    fontSize: 28,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff0f0",
    marginBottom: 8,
  },
  guessButton: {
    backgroundColor: "#a8ede0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 16,
  },
  guessButtonText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
  },
  usedBoxWrapper: {
    alignItems: "center",
    marginTop: 8,
  },
  usedLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  usedBox: {
    backgroundColor: "#ffdede",
    padding: 12,
    borderRadius: 12,
    width: 280,
    minHeight: 60,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  result: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
  },
});
