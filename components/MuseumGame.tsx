import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";
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

const TILE_COUNT = 16;
const COLUMNS = 4;
const TILE_SIZE = 72;
const TIME_LIMIT = 30;

const imagePaths = [
  require("../assets/images/fossil/fossil1.jpg"),
  require("../assets/images/fossil/fossil2.jpg"),
  require("../assets/images/fossil/fossil3.jpg"),
  require("../assets/images/fossil/fossil4.jpg"),
  require("../assets/images/fossil/fossil5.jpg"),
  require("../assets/images/fossil/fossil6.jpg"),
  require("../assets/images/fossil/fossil7.jpg"),
  require("../assets/images/fossil/fossil8.jpg"),
  require("../assets/images/fossil/fossil9.jpg"),
  require("../assets/images/fossil/fossil10.jpg"),
  require("../assets/images/fossil/fossil11.jpg"),
  require("../assets/images/fossil/fossil12.jpg"),
  require("../assets/images/fossil/fossil13.jpg"),
  require("../assets/images/fossil/fossil14.jpg"),
  require("../assets/images/fossil/fossil15.jpg"),
  require("../assets/images/fossil/fossil16.jpg"),
];

type Props = {
  onWin: () => void;
  onFail: () => void;
};

export default function MuseumGame({ onWin, onFail }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "rules" | "game" | "done">(
    "intro"
  );
  const [gameOver, setGameOver] = useState(false);
  const [rotations, setRotations] = useState<number[]>(
    Array(TILE_COUNT)
      .fill(0)
      .map(() => [0, 90, 180, 270][Math.floor(Math.random() * 4)])
  );
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  let [fontsLoaded] = useFonts({ Cinzel_900Black });

  useEffect(() => {
    if (step !== "game") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t === 1) {
          clearInterval(timer);
          setGameOver(true);
          setIsCorrect(false);
          setStep("done");
        }
        return t > 0 ? t - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (step === "game" && rotations.every((r) => r === 0)) {
      setIsCorrect(true);
      setStep("done");
      onWin();
    }
  }, [rotations, step]);

  const rotateTile = (index: number) => {
    if (step !== "game" || gameOver) return;
    setRotations((prev) => {
      const newRotations = [...prev];
      newRotations[index] = (newRotations[index] + 90) % 360;
      return newRotations;
    });
  };

  const handleBackToMap = () => {
    if (isCorrect) {
      onWin();
    } else {
      onFail();
    }
    router.back();
  };

  if (step === "intro") {
    return (
      <GamePopupModal
        visible={true}
        imageSrc={require("../assets/images/shopowners/happymuseum.png")}
        message={
          "Welcome to the Museum!\n\n I'm the archeologist, I'd like a hand uncovering a fossil!"
        }
        onClose={() => setStep("rules")}
        buttonText="Next"
      />
    );
  }

  if (step === "rules") {
    return (
      <GamePopupModal
        visible={true}
        imageSrc={require("../assets/images/shopowners/happymuseum.png")}
        message="Tap to rotate the tiles. Uncover the fossil before time runs out!"
        onClose={() => setStep("game")}
        buttonText="Start Digging!"
      />
    );
  }

  if (step === "done") {
    return (
      <GamePopupModal
        visible={true}
        imageSrc={
          isCorrect
            ? require("../assets/images/shopowners/happymuseum.png")
            : require("../assets/images/shopowners/sadmuseum.png")
        }
        message={
          isCorrect
            ? "You restored the fossil! Here's your token!"
            : "🦴 You took too long… the fossil’s turned to dust!"
        }
        onClose={handleBackToMap}
        buttonText="Back to Map"
      />
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/mbg.png")}
      style={styles.background}
    >
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>⏳ {timeLeft}s</Text>
      </View>

      <View style={styles.frameArea}>
        <View style={styles.grid}>
          {imagePaths.map((source, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => rotateTile(index)}
              style={{ width: TILE_SIZE, height: TILE_SIZE }}
            >
              <Image
                source={source}
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  transform: [{ rotate: `${rotations[index]}deg` }],
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
  },
  timerContainer: {
    position: "absolute",
    top: 60,
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    zIndex: 2,
  },
  timerText: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Cinzel_900Black",
    color: "#004c3f",
  },
  frameArea: {
    marginTop: 220,
    width: TILE_SIZE * COLUMNS,
    height: TILE_SIZE * COLUMNS,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: TILE_SIZE * COLUMNS,
    bottom: 70,
  },
});
