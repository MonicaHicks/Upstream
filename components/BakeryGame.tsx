import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ALL_INGREDIENTS = [
  "Flour",
  "Yeast",
  "Water",
  "Salt",
  "Sugar",
  "Fish Oil",
  "Butter",
  "Milk",
];

type Props = {
  onWin: () => void;
};

export default function BakeryGame({ onWin }: Props) {
  const [secretRecipe, setSecretRecipe] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [won, setWon] = useState(false);

  useEffect(() => {
    // Shuffle ingredients and pick 4
    const shuffled = [...ALL_INGREDIENTS].sort(() => 0.5 - Math.random());
    setSecretRecipe(shuffled.slice(0, 4));
  }, []);

  const toggleIngredient = (ingredient: string) => {
    if (won || attemptsLeft <= 0) return;
    if (selected.includes(ingredient)) {
      setSelected(selected.filter((i) => i !== ingredient));
    } else {
      if (selected.length < 4) setSelected([...selected, ingredient]);
    }
  };

  const handleBake = () => {
    if (won || attemptsLeft <= 0 || selected.length !== 4) return;
    const correctCount = selected.filter((i) =>
      secretRecipe.includes(i)
    ).length;

    if (correctCount === 4) {
      setWon(true);
      setFeedback("Perfect! You guessed the full recipe!");
      onWin();
    } else {
      const nextAttempts = attemptsLeft - 1;
      setAttemptsLeft(nextAttempts);
      setFeedback(
        nextAttempts > 0
          ? `\u274C ${correctCount} ingredient(s) correct. ${nextAttempts} tries left.`
          : "\u274C You ran out of attempts!"
      );
    }
    setSelected([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🍞 Pick 4 ingredients to match the mystery recipe:
      </Text>
      <FlatList
        data={ALL_INGREDIENTS}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={{ gap: 12 }}
        columnWrapperStyle={{ gap: 12, justifyContent: "center" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleIngredient(item)}
            style={[
              styles.ingredientButton,
              selected.includes(item) && styles.selectedIngredient,
            ]}
          >
            <Text style={styles.ingredientText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity onPress={handleBake} style={styles.bakeButton}>
        <Text style={styles.bakeText}>{attemptsLeft} attempt left</Text>
      </TouchableOpacity>

      {feedback !== "" && <Text style={styles.feedback}>{feedback}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20, alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  ingredientButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f2e8d5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedIngredient: {
    backgroundColor: "#d4a373",
    borderColor: "#8b5e3c",
  },
  ingredientText: { fontSize: 16, fontWeight: "bold" },
  bakeButton: {
    marginTop: 12,
    backgroundColor: "#6b4226",
    padding: 12,
    borderRadius: 8,
  },
  bakeText: { color: "white", fontWeight: "bold" },
  feedback: { fontSize: 16, marginTop: 12, textAlign: "center" },
});
