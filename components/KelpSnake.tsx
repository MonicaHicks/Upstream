import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";
import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CELL_SIZE = 24;
const GRID_SIZE = 15;
const GAME_TICK_MS = 200;
const INITIAL_SNAKE = [
  { x: 2, y: GRID_SIZE - 2 },
  { x: 1, y: GRID_SIZE - 2 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };

function getRandomFood(snake: any) {
  let newFood: any;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (
      !snake.some(
        (segment: any) => segment.x === newFood.x && segment.y === newFood.y
      )
    ) {
      return newFood;
    }
  }
}

type Props = {
  onWin: () => void;
  onFail: () => void;
};

export default function KelpSnake({ onWin, onFail }: Props) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [gameOver, setGameOver] = useState(false);
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
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        if (
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y >= GRID_SIZE ||
          prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setGameOver(true);
          onFail();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        const isEating = newHead.x === food.x && newHead.y === food.y;

        if (isEating) {
          const nextFood = getRandomFood(newSnake);
          setFood(nextFood);
          if (newSnake.length >= 10) {
            onWin();
            clearInterval(interval);
          }
          return newSnake;
        } else {
          newSnake.pop();
          return newSnake;
        }
      });
    }, GAME_TICK_MS);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  const handleArrow = (dx: number, dy: number) => {
    setDirection({ x: dx, y: dy });
  };

  const renderCell = (x: number, y: number) => {
    const isHead = snake[0].x === x && snake[0].y === y;
    const isBody = snake.some(
      (seg, idx) => idx > 0 && seg.x === x && seg.y === y
    );
    const isFood = food.x === x && food.y === y;
    let cellContent = "";
    if (isHead) cellContent = "🪴";
    else if (isBody) cellContent = "🌱"; // kelp :D
    else if (isFood) cellContent = "☀️";

    return (
      <View key={`${x}-${y}`} style={styles.cell}>
        <Text style={styles.cellText}>{cellContent}</Text>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.lengthText}>Length: {snake.length}</Text>
      {gameOver ? (
        <Text style={styles.gameOverText}>🌱 The kelp wilted!</Text>
      ) : (
        <>
          <View style={styles.gridWrapper}>
            <View style={styles.grid}>
              {[...Array(GRID_SIZE)].flatMap((_, y) =>
                [...Array(GRID_SIZE)].map((_, x) => renderCell(x, y))
              )}
            </View>
          </View>
          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={() => handleArrow(0, -1)}>
              <Text style={styles.arrow}>⬆️</Text>
            </TouchableOpacity>
            <View style={styles.arrowRow}>
              <TouchableOpacity onPress={() => handleArrow(-1, 0)}>
                <Text style={styles.arrow}>⬅️</Text>
              </TouchableOpacity>
              <View style={{ width: 24 }} />
              <TouchableOpacity onPress={() => handleArrow(1, 0)}>
                <Text style={styles.arrow}>➡️</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => handleArrow(0, 1)}>
              <Text style={styles.arrow}>⬇️</Text>
            </TouchableOpacity>
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
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 20,
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
  arrow: {
    fontSize: 40,
    fontFamily: "Cinzel_900Black",
    padding: 4,
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Cinzel_900Black",
    color: "#444",
    textAlign: "center",
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
