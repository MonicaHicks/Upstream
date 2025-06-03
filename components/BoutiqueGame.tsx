import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GamePopupModal from "./GamePopUpModal";

import color1 from "../assets/images/colors/color1.png";
import color10 from "../assets/images/colors/color10.png";
import color11 from "../assets/images/colors/color11.png";
import color12 from "../assets/images/colors/color12.png";
import color13 from "../assets/images/colors/color13.png";
import color14 from "../assets/images/colors/color14.png";
import color15 from "../assets/images/colors/color15.png";
import color16 from "../assets/images/colors/color16.png";
import color2 from "../assets/images/colors/color2.png";
import color3 from "../assets/images/colors/color3.png";
import color4 from "../assets/images/colors/color4.png";
import color5 from "../assets/images/colors/color5.png";
import color6 from "../assets/images/colors/color6.png";
import color7 from "../assets/images/colors/color7.png";
import color8 from "../assets/images/colors/color8.png";
import color9 from "../assets/images/colors/color9.png";

const COLOR_IMAGES = [
  { name: "color1", source: color1 },
  { name: "color2", source: color2 },
  { name: "color3", source: color3 },
  { name: "color4", source: color4 },
  { name: "color5", source: color5 },
  { name: "color6", source: color6 },
  { name: "color7", source: color7 },
  { name: "color8", source: color8 },
  { name: "color9", source: color9 },
  { name: "color10", source: color10 },
  { name: "color11", source: color11 },
  { name: "color12", source: color12 },
  { name: "color13", source: color13 },
  { name: "color14", source: color14 },
  { name: "color15", source: color15 },
  { name: "color16", source: color16 },
];

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type Props = {
  onWin: () => void;
  onFail: () => void;
};

export default function PantoneParade({ onWin, onFail }: Props) {
  const router = useRouter();

  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [shuffled, setShuffled] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [revealed, setRevealed] = useState(true);
  const [viewTime, setViewTime] = useState(5);
  const [playTime, setPlayTime] = useState(15);
  const [viewTimer, setViewTimer] = useState(5);
  const [playTimer, setPlayTimer] = useState(15);
  const intervalRef = useRef(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      startRound(round);
    }
    return () => clearInterval(intervalRef.current);
  }, [round, gameStarted]);

  const startRound = (roundNum) => {
    const chosen = shuffleArray(COLOR_IMAGES).slice(0, roundNum + 2);
    setSequence(chosen);
    setShuffled(shuffleArray(chosen));
    setSelected([]);
    setIsCorrect(null);
    setRevealed(true);
    setViewTimer(viewTime);
    setPlayTimer(playTime);

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setViewTimer((prev) => {
        if (prev === 1) {
          clearInterval(intervalRef.current);
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
          clearInterval(intervalRef.current);
          setIsCorrect(false);
          setShowEndModal(true);
        }

        return prev - 1;
      });
    }, 1000);
  };

  const handleSelect = (color) => {
    if (selected.length >= sequence.length || isCorrect !== null) return;
    const updated = [...selected, color];
    setSelected(updated);
    if (updated.length === sequence.length) {
      const correct = updated.every((c, i) => c.name === sequence[i].name);
      clearInterval(intervalRef.current);
      if (correct) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
        setShowEndModal(true);
      }
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
      setShowEndModal(true);
    }
  };

  const renderColorGrid = () => (
    <View style={styles.grid}>{shuffled.map((c) => renderBlock(c))}</View>
  );

  const renderBlock = (item) => (
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

  const handleBackToMap = () => {
    if (isCorrect === "win") {
      onWin();
    } else {
      onFail();
    }
    router.back();
  };

  return (
    <>
      <GamePopupModal
        visible={showIntro}
        imageSrc={require("../assets/images/shopowners/happyboutique.png")}
        message={"Welcome to Color Match! I’m the boutique’s stylist fish 💅"}
        onClose={() => {
          setShowIntro(false);
          setShowRules(true);
        }}
        buttonText="Let's go!"
      />

      <GamePopupModal
        visible={showRules}
        imageSrc={require("../assets/images/shopowners/happyboutique.png")}
        message={
          "Memorize the color lineup, then recreate it in the right order. Complete 3 rounds to win!"
        }
        onClose={() => {
          setShowRules(false);
          setGameStarted(true);
        }}
        buttonText="Start Game"
      />

      <GamePopupModal
        visible={showEndModal}
        imageSrc={
          isCorrect === "win"
            ? require("../assets/images/shopowners/happyboutique.png")
            : require("../assets/images/shopowners/sadboutique.png")
        }
        message={
          isCorrect === "win"
            ? "💫 Stunning! You've got the style, darling. Collect your token and strut!"
            : "A fashion faux pas! Try again, darling"
        }
        onClose={handleBackToMap}
        buttonText="Back to Map"
      />

      {!showIntro && !showRules && (
        <View style={styles.container}>
          <Text style={styles.title}>Color Match</Text>
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
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
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
        </View>
      )}
    </>
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
