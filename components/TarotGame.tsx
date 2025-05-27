import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CARD_IMAGES = [
  require("../assets/images/tarot/tarot-cross.jpeg"),
  require("../assets/images/tarot/tarot-cup.jpeg"),
  require("../assets/images/tarot/tarot-moon.jpeg"),
  require("../assets/images/tarot/tarot-star.jpeg"),
  require("../assets/images/tarot/tarot-sun.jpeg"),
];
const CARD_BACK_IMAGE = require("../assets/images/tarot/tarot-back.jpeg");

function shuffleCards(): {
  id: number;
  symbol: string;
  matched: boolean;
  flipped: boolean;
}[] {
  const pairs = [...CARD_IMAGES, ...CARD_IMAGES];
  pairs.splice(Math.floor(Math.random() * pairs.length), 1); // Remove one for the odd card
  const shuffled = pairs.sort(() => 0.5 - Math.random());
  return shuffled.map((symbol, index) => ({
    id: index,
    symbol,
    matched: false,
    flipped: false,
  }));
}

type Props = {
  onWin: () => void;
};

export default function TarotGame({ onWin }: Props) {
  const [cards, setCards] = useState(() => shuffleCards());
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [feedback, setFeedback] = useState("");

  const handleFlip = (index: number) => {
    if (cards[index].flipped || selected.length === 2 || attemptsLeft === 0)
      return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    const newSelected = [...selected, index];
    setSelected(newSelected);
  };

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.symbol === secondCard.symbol) {
        const updated = [...cards];
        updated[first].matched = true;
        updated[second].matched = true;
        setCards(updated);
        setMatches(matches + 1);
        setFeedback("\u2705 You found a match!");
        setSelected([]);
        if (matches + 1 >= 3) onWin();
      } else {
        setTimeout(() => {
          const updated = [...cards];
          updated[first].flipped = false;
          updated[second].flipped = false;
          setCards(updated);
          setSelected([]);
        }, 800);
        const remaining = attemptsLeft - 1;
        setAttemptsLeft(remaining);
        setFeedback(
          remaining > 0
            ? `\u274C No match. ${remaining} lives left.`
            : "\u274C You're out of readings!"
        );
      }
    }
  }, [selected]);

  const renderCard = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={[
        styles.card,
        item.flipped || item.matched ? styles.card : styles.card,
      ]}
      onPress={() => handleFlip(index)}
      disabled={item.flipped || item.matched}
    >
      {item.flipped || item.matched ? (
        <Image source={item.symbol} style={styles.card} resizeMode="contain" />
      ) : (
        <Image
          source={CARD_BACK_IMAGE}
          style={styles.card}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔮 Flip cards to find 3 matching pairs:</Text>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        renderItem={renderCard}
        columnWrapperStyle={{ justifyContent: "center" }}
        contentContainerStyle={{
          gap: 10,
          paddingBottom: 20,
          height: 280, // ✅ add fixed height to avoid nesting warning
        }}
      />
      <Text style={styles.feedback}>{feedback}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20, alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  card: {
    width: 70,
    height: 70,
    borderRadius: 8,
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  feedback: {
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
  cardImage: {
    width: 50,
    height: 50,
  },
});
