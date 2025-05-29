import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GamePopupModal from "./GamePopUpModal";

const GRID_SIZE = 6;
const TILE_SIZE = 50;
const MATCH_MIN = 3;

const HAT_IMAGES: ImageSourcePropType[] = [
  require("../assets/images/hats/hat1.png"),
  require("../assets/images/hats/hat2.png"),
  require("../assets/images/hats/hat3.png"),
  require("../assets/images/hats/hat4.png"),
  require("../assets/images/hats/hat5.png"),
];

type GridType = (number | null)[][];

type Match =
  | { row: number; startCol: number; endCol: number }
  | { col: number; startRow: number; endRow: number };

const generateSafeGrid = (): GridType => {
  const grid: GridType = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    const row: (number | null)[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      let tile: number;
      let tries = 0;
      do {
        tile = Math.floor(Math.random() * HAT_IMAGES.length);
        row[c] = tile;
        tries++;
      } while (
        ((c >= 2 && row[c] === row[c - 1] && row[c] === row[c - 2]) ||
          (r >= 2 && grid[r - 1][c] === tile && grid[r - 2][c] === tile)) &&
        tries < 10
      );
    }
    grid.push(row);
  }

  return grid;
};

const cloneGrid = (grid: GridType): GridType => grid.map((row) => [...row]);

type Props = {
  onWin: () => void;
  onFail: () => void;
};

export default function HatGame({ onWin, onFail }: Props) {
  const [grid, setGrid] = useState<GridType>(generateSafeGrid);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(
    null
  );
  const [score, setScore] = useState<number>(0);
  const [resolving, setResolving] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showRules, setShowRules] = useState(false);

  let [fontsLoaded] = useFonts({
    Cinzel_900Black,
  });

  const handlePress = (row: number, col: number) => {
    if (resolving) return;

    if (!selected) {
      setSelected({ row, col });
    } else {
      const { row: r, col: c } = selected;
      const isAdjacent =
        (Math.abs(row - r) === 1 && col === c) ||
        (Math.abs(col - c) === 1 && row === r);

      if (isAdjacent) {
        const newGrid = cloneGrid(grid);
        const temp = newGrid[r][c];
        newGrid[r][c] = newGrid[row][col];
        newGrid[row][col] = temp;

        if (hasMatch(newGrid)) {
          setGrid(newGrid);
          setSelected(null);
          setTimeout(() => resolveMatches(newGrid), 200);
        } else {
          setSelected(null);
        }
      } else {
        setSelected({ row, col });
      }
    }
  };

  const hasMatch = (g: GridType): boolean => {
    return findMatches(g).length > 0;
  };

  const findMatches = (g: GridType): Match[] => {
    const matches: Match[] = [];

    // Check rows
    for (let r = 0; r < GRID_SIZE; r++) {
      let count = 1;
      for (let c = 1; c < GRID_SIZE; c++) {
        if (g[r][c] !== null && g[r][c] === g[r][c - 1]) {
          count++;
        } else {
          if (count >= MATCH_MIN)
            matches.push({ row: r, startCol: c - count, endCol: c - 1 });
          count = 1;
        }
      }
      if (count >= MATCH_MIN)
        matches.push({
          row: r,
          startCol: GRID_SIZE - count,
          endCol: GRID_SIZE - 1,
        });
    }

    // Check columns
    for (let c = 0; c < GRID_SIZE; c++) {
      let count = 1;
      for (let r = 1; r < GRID_SIZE; r++) {
        if (g[r][c] !== null && g[r][c] === g[r - 1][c]) {
          count++;
        } else {
          if (count >= MATCH_MIN)
            matches.push({ col: c, startRow: r - count, endRow: r - 1 });
          count = 1;
        }
      }
      if (count >= MATCH_MIN)
        matches.push({
          col: c,
          startRow: GRID_SIZE - count,
          endRow: GRID_SIZE - 1,
        });
    }

    return matches;
  };

  const resolveMatches = (startingGrid: GridType) => {
    if (resolving) return;
    setResolving(true);

    const newGrid = cloneGrid(startingGrid);
    const matches = findMatches(newGrid);

    if (matches.length === 0) {
      setResolving(false);
      return;
    }

    matches.forEach((match) => {
      if ("row" in match) {
        for (let c = match.startCol; c <= match.endCol; c++) {
          newGrid[match.row][c] = null;
        }
      } else {
        for (let r = match.startRow; r <= match.endRow; r++) {
          newGrid[r][match.col] = null;
        }
      }
    });

    const cleared = matches.reduce((sum, m) => {
      return (
        sum +
        ("row" in m ? m.endCol - m.startCol + 1 : m.endRow - m.startRow + 1)
      );
    }, 0);
    const newScore = score + cleared;
    setScore(newScore);

    if (newScore >= 25) {
      onWin();
      return;
    }

    // Collapse columns
    for (let c = 0; c < GRID_SIZE; c++) {
      let colTiles: (number | null)[] = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        if (newGrid[r][c] !== null) colTiles.push(newGrid[r][c]);
      }
      while (colTiles.length < GRID_SIZE) {
        colTiles.unshift(Math.floor(Math.random() * HAT_IMAGES.length));
      }
      for (let r = 0; r < GRID_SIZE; r++) {
        newGrid[r][c] = colTiles[r];
      }
    }

    setGrid(newGrid);
    setTimeout(() => {
      setResolving(false);
      resolveMatches(newGrid);
    }, 200);
  };

  const giveUp = () => {
    Alert.alert("Game Over", `Your final score: ${score}`);
    onFail();
  };

  return (
    <>
      <GamePopupModal
        visible={showIntro}
        imageSrc={require("../assets/images/shopowners/happyhat.png")}
        message={"I am the hat shop fish"}
        onClose={() => {
          setShowIntro(false);
          setShowRules(true);
        }}
      />

      <GamePopupModal
        visible={showRules}
        imageSrc={require("../assets/images/shopowners/happyhat.png")}
        message={
          "Match three hats in a row to make them disappear!\n\nGet 25 points to win."
        }
        onClose={() => setShowRules(false)}
      />

      {!showIntro && !showRules && (
        <View style={styles.container}>
          <Text style={styles.score}>🎩 Score: {score}</Text>
          <View style={styles.grid}>
            {grid.map((row, r) =>
              row.map((hatIndex, c) => (
                <TouchableOpacity
                  key={`${r}-${c}`}
                  style={[
                    styles.tile,
                    selected?.row === r &&
                      selected?.col === c &&
                      styles.selected,
                  ]}
                  onPress={() => handlePress(r, c)}
                >
                  {hatIndex !== null && (
                    <Image
                      source={HAT_IMAGES[hatIndex]}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
          <TouchableOpacity onPress={giveUp} style={styles.button}>
            <Text style={styles.buttonText}>Give Up</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingTop: 40 },
  score: { fontSize: 20, fontFamily: "Cinzel_900Black", marginBottom: 10 },
  grid: {
    width: GRID_SIZE * TILE_SIZE,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  selected: {
    borderColor: "#ff6600",
    borderWidth: 2,
  },
  image: {
    width: 40,
    height: 40,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Cinzel_900Black",
  },
});
