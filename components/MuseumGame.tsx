import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TILE_COUNT = 16;
const COLUMNS = 4;
const TILE_SIZE = Dimensions.get("window").width / 6;
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
};

export default function MuseumGame({ onWin }: Props) {
  const [gameOver, setGameOver] = useState(false);
  const [rotations, setRotations] = useState<number[]>(
    Array(TILE_COUNT)
      .fill(0)
      .map(() => [0, 90, 180, 270][Math.floor(Math.random() * 4)])
  );
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t === 1) {
          clearInterval(timer);
          setGameOver(true);
        }
        return t > 0 ? t - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!gameOver && rotations.every((r) => r === 0)) {
      onWin();
    }
  }, [rotations]);

  const rotateTile = (index: number) => {
    if (gameOver) return;
    setRotations((prev) => {
      const newRotations = [...prev];
      newRotations[index] = (newRotations[index] + 90) % 360;
      return newRotations;
    });
  };

  if (gameOver) {
    return (
      <View style={styles.centeredScreen}>
        <Text style={styles.gameOverText}>
          🦴 You took too long… the fossil’s turned to dust!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <Text style={styles.timerText}>Time: {timeLeft}s</Text>
      </View>
      <View style={styles.rightColumn}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#A9D5C7",
    padding: 20,
  },
  leftColumn: {
    width: 100, // Fixed width so timer doesn’t affect layout
    justifyContent: "center",
    alignItems: "center",
  },
  rightColumn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: TILE_SIZE * COLUMNS,
  },
  timerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#004c3f",
  },
  centeredScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A9D5C7",
    padding: 30,
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#004c3f",
  },
});
