import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const COLOR_IMAGES = [
  { name: "color1", source: require("../assets/images/colors/color1.png") },
  { name: "color2", source: require("../assets/images/colors/color2.png") },
  { name: "color3", source: require("../assets/images/colors/color3.png") },
  { name: "color4", source: require("../assets/images/colors/color4.png") },
  { name: "color5", source: require("../assets/images/colors/color5.png") },
  { name: "color6", source: require("../assets/images/colors/color6.png") },
  { name: "color7", source: require("../assets/images/colors/color7.png") },
  { name: "color8", source: require("../assets/images/colors/color8.png") },
  { name: "color9", source: require("../assets/images/colors/color9.png") },
  { name: "color10", source: require("../assets/images/colors/color10.png") },
  { name: "color11", source: require("../assets/images/colors/color11.png") },
  { name: "color12", source: require("../assets/images/colors/color12.png") },
  { name: "color13", source: require("../assets/images/colors/color13.png") },
  { name: "color14", source: require("../assets/images/colors/color14.png") },
  { name: "color15", source: require("../assets/images/colors/color15.png") },
  { name: "color16", source: require("../assets/images/colors/color16.png") },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface ColorItem {
  name: string;
  source: any;
}

type Props = {
  onWin: () => void;
  onFail: () => void;
};

export default function PantoneParade({ onWin, onFail }: Props) {
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState<ColorItem[]>([]);
  const [shuffled, setShuffled] = useState<ColorItem[]>([]);
  const [selected, setSelected] = useState<ColorItem[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | string | null>(null);
  const [revealed, setRevealed] = useState(true);
  const [viewTime] = useState(5);
  const [playTime] = useState(15);
  const [viewTimer, setViewTimer] = useState(5);
  const [playTimer, setPlayTimer] = useState(15);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startRound(round);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [round]);

  const startRound = (roundNum: number) => {
    const chosen = shuffleArray(COLOR_IMAGES).slice(0, roundNum + 2);
    setSequence(chosen);
    setShuffled(shuffleArray(chosen));
    setSelected([]);
    setIsCorrect(null);
    setRevealed(true);
    setViewTimer(viewTime);
    setPlayTimer(playTime);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setViewTimer((prev) => {
        if (prev === 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRevealed(false);
          startPlayTimer();
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startPlayTimer = () => {
    intervalRef.current = setInterval(() => {
      setPlayTimer((prev) => {
        if (prev === 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsCorrect(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSelect = (color: ColorItem) => {
    if (selected.length >= sequence.length || isCorrect !== null) return;
    const updated = [...selected, color];
    setSelected(updated);
    if (updated.length === sequence.length) {
      const correct = updated.every((c, i) => c.name === sequence[i].name);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsCorrect(correct);
    }
  };

  const handleDelete = () => {
    if (selected.length === 0 || isCorrect !== null) return;
    const updated = [...selected];
    updated.pop();
    setSelected(updated);
  };

  const handleNext = () => {
    if (round < 3) {
      setRound(round + 1);
    } else {
      setIsCorrect("win");
    }
  };

  const handleReset = () => {
    setRound(1);
    startRound(1);
  };

  const renderBlock = (item: ColorItem) => (
    <TouchableOpacity
      key={item.name}
      style={styles.imageWrapper}
      onPress={() => handleSelect(item)}
      disabled={revealed || selected.includes(item)}
    >
      <Image
        source={item.source}
        style={styles.imageBlock}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderColorGrid = () => (
    <View style={styles.grid}>{shuffled.map((c) => renderBlock(c))}</View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantone Parade</Text>
      <Text style={styles.subtitle}>Round {round} of 3</Text>
      <Text style={styles.timerText}>
        {revealed
          ? `Memorize: ${viewTimer}s`
          : isCorrect === null
          ? `Time Left: ${playTimer}s`
          : null}
      </Text>

      <View style={styles.grid}>
        {(revealed ? sequence : selected).map((c, i) => (
          <View key={i} style={styles.imageWrapper}>
            <Image
              source={c.source}
              style={styles.smallImageBlock}
              resizeMode="contain"
            />
            <Text style={styles.numberLabel}>{i + 1}.</Text>
          </View>
        ))}
      </View>

      {!revealed && isCorrect === null && (
        <>
          {renderColorGrid()}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete Color</Text>
          </TouchableOpacity>
        </>
      )}

      {isCorrect === true && (
        <View>
          <Text style={styles.resultText}>🎉 Correct!</Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleNext}>
            <Text style={styles.resetText}>
              {round < 3 ? "Next Round" : "See Results"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isCorrect === false && (
        <View>
          <Text style={styles.resultText}>
            ❌ A fashion faux pas! Try again, darling.
          </Text>
        </View>
      )}

      {isCorrect === "win" && (
        <View>
          <Text style={styles.resultText}>🌟 You completed all rounds!</Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 16,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    maxWidth: 320,
  },
  imageWrapper: {
    alignItems: "center",
    margin: 5,
  },
  imageBlock: {
    width: 90,
    height: 120,
  },
  smallImageBlock: {
    width: 80,
    height: 110,
    margin: 5,
  },
  numberLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
  },
  resultText: {
    fontSize: 20,
    marginVertical: 20,
    textAlign: "center",
  },
  resetButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  resetText: {
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fdd",
    borderRadius: 6,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#900",
  },
});
