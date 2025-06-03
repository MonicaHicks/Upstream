// CafeGame.tsx
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ALL_INGREDIENTS = [
  "Espresso",
  "Oat Milk",
  "Vanilla Syrup",
  "Whipped Cream",
  "Ice",
  "Cocoa",
  "Matcha",
  "Foam",
  "Soy Milk",
  "Caramel",
  "Cinnamon",
];

const RECIPES = [
  {
    name: "Iced Vanilla Latte",
    ingredients: ["Espresso", "Oat Milk", "Vanilla Syrup", "Ice"],
  },
  {
    name: "Hot Cocoa",
    ingredients: ["Cocoa", "Foam", "Whipped Cream"],
  },
  {
    name: "Matcha Latte",
    ingredients: ["Matcha", "Soy Milk", "Foam"],
  },
  {
    name: "Caramel Macchiato",
    ingredients: ["Espresso", "Caramel", "Foam", "Whipped Cream"],
  },
];

type Props = {
  onWin: () => void;
  onFail: () => void;
};

export default function CafeGame({ onWin, onFail }: Props) {
  const [targetRecipe, setTargetRecipe] = useState(RECIPES[0]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [playerSelection, setPlayerSelection] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const recipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    const mixedIngredients = shuffleArray([
      ...recipe.ingredients,
      ...getRandomExtras(5),
    ]);
    setTargetRecipe(recipe);
    setIngredients(mixedIngredients);
    setPlayerSelection([]);
    setGameOver(false);
    setFeedback(null);
  };

  const shuffleArray = (array: string[]) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const getRandomExtras = (count: number): string[] => {
    const extras = ALL_INGREDIENTS.filter(
      (i) => !targetRecipe.ingredients.includes(i)
    );
    return shuffleArray(extras).slice(0, count);
  };

  const handleSelect = (item: string) => {
    if (gameOver || playerSelection.includes(item)) return;
    const updated = [...playerSelection, item];
    setPlayerSelection(updated);

    if (updated.length === targetRecipe.ingredients.length) {
      const correct =
        targetRecipe.ingredients.every((ing) => updated.includes(ing)) &&
        updated.length === targetRecipe.ingredients.length;
      setGameOver(true);
      setFeedback(correct ? "✔️ Correct Order!" : "❌ Wrong Order");
      setTimeout(() => {
        correct ? onWin() : onFail();
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Order:</Text>
      <Text style={styles.recipeName}>{targetRecipe.name}</Text>

      <View style={styles.grid}>
        {ingredients.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.ingredientButton,
              playerSelection.includes(item) && styles.selected,
            ]}
            onPress={() => handleSelect(item)}
            disabled={gameOver}
          >
            <Text style={styles.ingredientText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {feedback && <Text style={styles.feedback}>{feedback}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f3ebe1",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 20,
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  ingredientButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selected: {
    backgroundColor: "#d1e7dd",
  },
  ingredientText: {
    fontSize: 16,
  },
  feedback: {
    fontSize: 18,
    marginTop: 16,
  },
});
