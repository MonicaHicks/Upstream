import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GamePopupModal from "./GamePopUpModal";

interface Props {
  onWin: () => void;
  onFail: () => void;
}

const GRID_SIZE = 8;
const WORD_BANK = [
  "BREAD",
  "CAKE",
  "PASTRY",
  "ROLL",
  "MUFFIN",
  "COOKIE",
  "FLOUR",
  "TART",
  "BAGEL",
  "BUN",
  "DONUT",
  "SUGAR",
];
const TARGET_WORD_COUNT = 5;
const TIMER_SECONDS = 60;

type Coord = { row: number; col: number };

type Direction = [number, number];
const DIRECTIONS: Direction[] = [
  [0, 1], // horizontal
  [1, 0], // vertical
  [1, 1], // diagonal down-right
  [-1, 1], // diagonal up-right
];

function canPlace(
  word: string,
  row: number,
  col: number,
  dir: Direction,
  grid: string[][]
): boolean {
  for (let i = 0; i < word.length; i++) {
    const r = row + dir[0] * i;
    const c = col + dir[1] * i;
    if (r < 0 || c < 0 || r >= GRID_SIZE || c >= GRID_SIZE) return false;
    if (grid[r][c] && grid[r][c] !== word[i]) return false;
  }
  return true;
}

function placeWord(
  word: string,
  grid: string[][],
  positions: Coord[][]
): boolean {
  for (let attempts = 0; attempts < 100; attempts++) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    if (canPlace(word, row, col, dir, grid)) {
      const coords: Coord[] = [];
      for (let i = 0; i < word.length; i++) {
        const r = row + dir[0] * i;
        const c = col + dir[1] * i;
        grid[r][c] = word[i];
        coords.push({ row: r, col: c });
      }
      positions.push(coords);
      return true;
    }
  }
  return false;
}

function generateGrid(
  words: string[],
  size: number,
  positions: Coord[][]
): string[][] {
  const grid: string[][] = Array.from({ length: size }, () =>
    Array(size).fill("")
  );
  words.forEach((word) => placeWord(word, grid, positions));
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
  return grid;
}

export default function BakeryWordSearch({ onWin, onFail }: Props) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [selected, setSelected] = useState<Coord[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [foundCoords, setFoundCoords] = useState<Coord[][]>([]);
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [wordPositions, setWordPositions] = useState<Coord[][]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [showHint, setShowHint] = useState(false);

  let [fontsLoaded] = useFonts({
    Cinzel_900Black,
  });

  useEffect(() => {
    const chosenWords = WORD_BANK.sort(() => 0.5 - Math.random()).slice(
      0,
      TARGET_WORD_COUNT
    );
    const positions: Coord[][] = [];
    const newGrid = generateGrid(chosenWords, GRID_SIZE, positions);
    setTargetWords(chosenWords);
    setWordPositions(positions);
    setGrid(newGrid);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFail();
    } else {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const toggleSelect = (row: number, col: number) => {
    const exists = selected.some(
      (coord) => coord.row === row && coord.col === col
    );
    setSelected((prev) =>
      exists
        ? prev.filter((c) => !(c.row === row && c.col === col))
        : [...prev, { row, col }]
    );
  };

  const checkSelection = () => {
    const word = selected.map(({ row, col }) => grid[row][col]).join("");
    const matchIndex = targetWords.findIndex((w) => w === word);
    if (matchIndex !== -1 && !found.includes(targetWords[matchIndex])) {
      const newFound = [...found, targetWords[matchIndex]];
      setFound(newFound);
      setFoundCoords([...foundCoords, wordPositions[matchIndex]]);
      if (newFound.length === TARGET_WORD_COUNT) {
        onWin();
      }
    } else {
      Alert.alert("No Match", "That combination is not a target word.");
    }
    setSelected([]);
  };

  const isSelected = (row: number, col: number) =>
    selected.some((c) => c.row === row && c.col === col);
  const isFound = (row: number, col: number) =>
    foundCoords.some((coords) =>
      coords.some((c) => c.row === row && c.col === col)
    );

  return (
    <>
      <GamePopupModal
        visible={showIntro}
        imageSrc={require("../assets/images/shopowners/happybakery.png")}
        message={"I am the bakery fish"}
        onClose={() => {
          setShowIntro(false);
          setShowRules(true);
        }}
      />

      <GamePopupModal
        visible={showRules}
        imageSrc={require("../assets/images/shopowners/happybakery.png")}
        message={"Help me finalize my menu by finding the words!"}
        onClose={() => setShowRules(false)}
      />

      <GamePopupModal
        visible={showHint}
        imageSrc={require("../assets/images/shopowners/happybakery.png")}
        message={`Your words are: ${targetWords.join(", ")}`}
        onClose={() => setShowHint(false)}
      />

      {!showIntro && !showRules && (
        <View style={styles.container}>
          <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
          <Text style={styles.instructions}>
            {TARGET_WORD_COUNT - found.length} words left
          </Text>
          <View style={styles.gridContainer}>
            {grid.map((row, r) => (
              <View key={r} style={styles.row}>
                {row.map((letter, c) => (
                  <Pressable
                    key={`${r}-${c}`}
                    onPress={() => toggleSelect(r, c)}
                    style={[
                      styles.cell,
                      isSelected(r, c) && styles.selectedCell,
                      isFound(r, c) && styles.foundCell,
                    ]}
                  >
                    <Text style={styles.cellText}>{letter}</Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
          <Text style={styles.foundText}>Found: {found.join(", ")}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={checkSelection}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>Submit Word</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowHint(true)}
              style={styles.hintButton}
            >
              <Text style={styles.hintText}>Hint</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontFamily: "Cinzel_900Black",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timer: {
    fontFamily: "Cinzel_900Black",
    fontSize: 25,
    color: "#b22222",
    marginBottom: 5,
  },
  instructions: {
    fontFamily: "Cinzel_900Black",
    fontSize: 16,
    marginBottom: 10,
  },
  gridContainer: { marginBottom: 20 },
  row: { flexDirection: "row" },
  cell: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    backgroundColor: "#f2e8d5",
  },
  selectedCell: {
    backgroundColor: "#d4a373",
  },
  foundCell: {
    backgroundColor: "#90ee90",
  },
  cellText: { fontFamily: "Cinzel_900Black", fontSize: 20, fontWeight: "bold" },
  submitButton: {
    backgroundColor: "#6b4226",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    fontFamily: "Cinzel_900Black",
  },
  submitText: {
    fontFamily: "Cinzel_900Black",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  hintButton: {
    backgroundColor: "#d4a373",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: "40%",
  },
  hintText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Cinzel_900Black",
    textAlign: "center",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  foundText: { fontFamily: "Cinzel_900Black", fontSize: 16, marginTop: 10 },
});
