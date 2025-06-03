import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import arrow from "../assets/images/kelpass/arrow.png";
import sun from "../assets/images/kelpass/sun.png";
import GamePopupModal from "./GamePopUpModal";

const CELL_SIZE = 20;
const GRID_SIZE = 15;
const GAME_TICK_MS = 200;
const INITIAL_SNAKE = [
  { x: 2, y: GRID_SIZE - 2 },
  { x: 1, y: GRID_SIZE - 2 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };

function getRandomFood(snake) {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((s) => s.x === newFood.x && s.y === newFood.y)) {
      return newFood;
    }
  }
}

type Props = {
  onWin: () => void;
};

export default function KelpSnake({ onWin }: Props) {
  const router = useRouter();
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [step, setStep] = useState<"intro" | "rules" | "game" | "done">(
    "intro"
  );

  let [fontsLoaded] = useFonts({
    Cinzel_900Black,
  });

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case "ArrowUp":
            setDirection({ x: 0, y: -1 });
            break;
          case "ArrowDown":
            setDirection({ x: 0, y: 1 });
            break;
          case "ArrowLeft":
            setDirection({ x: -1, y: 0 });
            break;
          case "ArrowRight":
            setDirection({ x: 1, y: 0 });
            break;
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  useEffect(() => {
    if (step !== "game" || gameOver || hasWon) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const newHead = {
          x: prev[0].x + direction.x,
          y: prev[0].y + direction.y,
        };

        if (
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y >= GRID_SIZE ||
          prev.some((s) => s.x === newHead.x && s.y === newHead.y)
        ) {
          setGameOver(true);
          setStep("done");
          return prev;
        }

        const newSnake = [newHead, ...prev];
        const isEating = newHead.x === food.x && newHead.y === food.y;

        if (isEating) {
          setFood(getRandomFood(newSnake));
          return newSnake;
        } else {
          newSnake.pop();
          return newSnake;
        }
      });
    }, GAME_TICK_MS);

    return () => clearInterval(interval);
  }, [direction, food, step]);

  useEffect(() => {
    if (!gameOver && snake.length >= 10 && !hasWon) {
      setHasWon(true);
      setStep("done");
      onWin();
    }
  }, [snake]);

  const handleBackToMap = () => {
    router.back();
  };

  const handleArrow = (dx: number, dy: number) => {
    setDirection({ x: dx, y: dy });
  };

  const renderCell = (x: number, y: number) => {
    const isHead = snake[0].x === x && snake[0].y === y;
    const isBody = snake.some(
      (seg, idx) => idx > 0 && seg.x === x && seg.y === y
    );
    const isFood = food.x === x && food.y === y;
    let content = null;

    if (isFood) {
      content = (
        <Image
          source={sun}
          style={{ width: CELL_SIZE - 4, height: CELL_SIZE - 4 }}
        />
      );
    } else if (isHead) {
      content = <Text style={styles.cellText}>🪴</Text>;
    } else if (isBody) {
      content = <Text style={styles.cellText}>🌱</Text>;
    }

    return (
      <View key={`${x}-${y}`} style={styles.cell}>
        {content}
      </View>
    );
  };

  const renderArrow = (rotation: string, onPress: () => void) => (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={arrow}
        style={{
          width: 40,
          height: 40,
          transform: [{ rotate: rotation }],
        }}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      {/* Intro Modal */}
      {step === "intro" && (
        <GamePopupModal
          visible={true}
          imageSrc={require("../assets/images/shopowners/happykelp.png")}
          message={
            "I'm the kelp gardener!\n\nMy kelp is having a hard time getting enough sun at this depth-\n\n can you help? 🌱"
          }
          onClose={() => setStep("rules")}
          buttonText="Next"
        />
      )}

      {/* Rules Modal */}
      {step === "rules" && (
        <GamePopupModal
          visible={true}
          imageSrc={require("../assets/images/shopowners/happykelp.png")}
          message={
            "Use the orange arrows to guide the kelp to the sun.\n\nBe careful not to let the kelp touch itself or the walls.\n\n Reach 10 segments to win!"
          }
          onClose={() => setStep("game")}
          buttonText="Start Growing!"
        />
      )}

      {/* End Modal */}
      {step === "done" && (
        <GamePopupModal
          visible={true}
          imageSrc={
            hasWon
              ? require("../assets/images/shopowners/happykelp.png")
              : require("../assets/images/shopowners/sadkelp.png")
          }
          message={
            hasWon
              ? "You did it! That kelp is thriving 🪴"
              : "Oh no! The kelp wilted. Better luck next time 🌊"
          }
          onClose={handleBackToMap}
          buttonText="Back to Map"
        />
      )}

      {/* Game UI */}
      {step === "game" && (
        <>
          <Text style={styles.lengthText}>Length: {snake.length}</Text>
          <View style={styles.gridWrapper}>
            <View style={styles.grid}>
              {[...Array(GRID_SIZE)].flatMap((_, y) =>
                [...Array(GRID_SIZE)].map((_, x) => renderCell(x, y))
              )}
            </View>
          </View>
          <View style={styles.controlsContainer}>
            {renderArrow("-90deg", () => handleArrow(0, -1))}
            <View style={styles.arrowRow}>
              {renderArrow("180deg", () => handleArrow(-1, 0))}
              <View style={{ width: 24 }} />
              {renderArrow("0deg", () => handleArrow(1, 0))}
            </View>
            {renderArrow("90deg", () => handleArrow(0, 1))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#d0ede4",
    alignItems: "center",
    justifyContent: "center",
  },
  gridWrapper: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    width: GRID_SIZE * CELL_SIZE + 34,
    height: GRID_SIZE * CELL_SIZE + 34,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    width: GRID_SIZE * CELL_SIZE,
    height: GRID_SIZE * CELL_SIZE,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  cellText: {
    fontSize: CELL_SIZE - 4,
    fontFamily: "Cinzel_900Black",
    textAlign: "center",
  },
  controlsContainer: {
    gap: 4,
    alignItems: "center",
  },
  arrowRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  lengthText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Cinzel_900Black",
    marginTop: 15,
    marginBottom: 8,
    color: "#004c3f",
  },
});
