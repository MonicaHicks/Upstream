import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ALL_INGREDIENTS = [
  "Flour",
  "Vanilla",
  "Milk",
  "Yeast",
  "Water",
  "Salt",
  "Sugar",
  "Fish Oil",
  "Butter",
  "Cinnamon",
];

type Props = {
  onWin: () => void;
};

export default function BakeryGame({ onWin }: Props) {
  const [round, setRound] = useState(1);
  const [order, setOrder] = useState<string[]>([]);
  const [showOrder, setShowOrder] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [feedback, setFeedback] = useState("");
  const [time, setTime] = useState(1000);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    setSelected([]);
    setFeedback("");
    const shuffled = [...ALL_INGREDIENTS].sort(() => 0.5 - Math.random());
    const newOrder = shuffled.slice(0, 4);
    setOrder(newOrder);
    setShowOrder(true);
    setTime(time - 250);
    setTimeout(() => {
      setShowOrder(false);
    }, time);
  };

  const toggleIngredient = (ingredient: string) => {
    if (selected.includes(ingredient) || selected.length >= 4) return;
    setSelected([...selected, ingredient]);
  };

  const handleSubmit = () => {
    if (selected.length !== 4 || !order.length) return;

    const isCorrect =
      selected.length === order.length &&
      selected.every((i) => order.includes(i));

    const updatedResults = [...results, isCorrect];
    setResults(updatedResults);

    if (!isCorrect) {
      setFeedback(`❌ Round ${round} incorrect!`);
    } else {
      setFeedback(`✅ Round ${round} correct!`);
    }

    if (round === 3) {
      // Final round - decide win or loss
      setTimeout(() => {
        if (updatedResults.every((r) => r)) {
          onWin();
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setRound(round + 1);
        startNewRound();
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍞 Round {round} of 3</Text>
      {showOrder ? (
        <>
          <Text style={styles.flashText}>🧾 Memorize the Order!</Text>
          <Text style={styles.orderText}>{order.join("  ·  ")}</Text>
        </>
      ) : results.length >= round ? (
        <Text style={styles.feedback}>{feedback}</Text>
      ) : (
        <>
          <Text style={styles.instructions}>
            Select the 4 ingredients you saw:
          </Text>
          <View style={styles.grid}>
            {ALL_INGREDIENTS.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleIngredient(item)}
                style={[
                  styles.ingredientButton,
                  selected.includes(item) && styles.selectedIngredient,
                ]}
              >
                <Text style={styles.ingredientText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={handleSubmit} style={styles.bakeButton}>
            <Text style={styles.bakeText}>Submit ({selected.length}/4)</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20, alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  flashText: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 8,
    color: "#a0522d",
  },
  orderText: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "#ffe5b4",
    borderRadius: 10,
    textAlign: "center",
  },
  instructions: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
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
  feedback: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
});
