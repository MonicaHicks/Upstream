import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const COLORS = ["#ff6b6b", "#feca57", "#1dd1a1", "#54a0ff"];
const COLOR_NAMES = ["Red", "Yellow", "Green", "Blue"];
const SEQUENCE_LENGTH = 5;
const DISPLAY_TIME = 700;

type Props = {
  onWin: () => void;
  onFail: () => void;
};

export default function BoutiqueGame({ onWin, onFail }: Props) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [showingIndex, setShowingIndex] = useState<number>(-1);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [score, setScore] = useState(0);
  let [fontsLoaded] = useFonts({
    Cinzel_900Black,
  });

  const playSequence = (newSeq: number[]) => {
    let i = 0;
    const interval = setInterval(() => {
      setShowingIndex(i);
      i++;
      if (i === newSeq.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowingIndex(-1);
          setInputEnabled(true);
        }, DISPLAY_TIME);
      }
    }, DISPLAY_TIME);
  };

  useEffect(() => {
    const newSeq = Array.from({ length: SEQUENCE_LENGTH }, () =>
      Math.floor(Math.random() * COLORS.length)
    );
    setSequence(newSeq);
    setPlayerInput([]);
    setInputEnabled(false);
    playSequence(newSeq);
  }, [score]);

  const handlePress = (colorIndex: number) => {
    if (!inputEnabled) return;

    const newInput = [...playerInput, colorIndex];
    setPlayerInput(newInput);

    if (sequence[newInput.length - 1] !== colorIndex) {
      Alert.alert("Oops!", "That's not the right color.", [
        {
          text: "Try Again",
          onPress: () => resetGame(),
        },
      ]);
      return;
    }

    if (newInput.length === sequence.length) {
      if (score + 1 === 3) {
        onWin();
      } else {
        setScore(score + 1);
      }
    }
  };

  const resetGame = () => {
    const newSeq = Array.from({ length: SEQUENCE_LENGTH }, () =>
      Math.floor(Math.random() * COLORS.length)
    );
    setSequence(newSeq);
    setPlayerInput([]);
    setScore(0);
    setInputEnabled(false);
    playSequence(newSeq);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛍️ Boutique Memory</Text>
      <Text style={styles.subtext}>Round: {score + 1}/3</Text>
      <View style={styles.grid}>
        {COLORS.map((color, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handlePress(i)}
            style={[
              styles.button,
              {
                backgroundColor: color,
                opacity: showingIndex === i ? 1 : 0.6,
              },
            ]}
            disabled={!inputEnabled}
          >
            <Text style={styles.label}>{COLOR_NAMES[i]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5e9f3",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Cinzel_900Black",
    color: "#5c0036",
    textAlign: "center",
  },
  subtext: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: "Cinzel_900Black",
    color: "#5c0036",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  button: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Cinzel_900Black",
  },
});
