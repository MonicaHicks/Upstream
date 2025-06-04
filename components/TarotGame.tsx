import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GamePopupModal from "./GamePopUpModal";

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
  symbol: any;
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
  onFail: () => void;
};

export default function TarotGame({ onWin, onFail }: Props) {
  const [cards, setCards] = useState(() => shuffleCards());
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const [showRules, setShowRules] = useState(false);

  const handleFlip = (index: number) => {
    if (cards[index].flipped || selected.length === 2 || attemptsLeft === 0)
      return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setSelected([...selected, index]);
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
        setFeedback("You found a match!");
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
            ? `No match. ${remaining} lives left.`
            : "You're out of readings!"
        );
        if (remaining <= 0) {
          onFail();
        }
      }
    }
  }, [selected]);

  const renderCard = (card: any, index: number) => (
    <TouchableOpacity
      key={card.id}
      style={styles.card}
      onPress={() => handleFlip(index)}
      disabled={card.flipped || card.matched}
    >
      <Image
        source={card.flipped || card.matched ? card.symbol : CARD_BACK_IMAGE}
        style={styles.card}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < cards.length; i += 3) {
      const rowCards = cards.slice(i, i + 3);
      rows.push(
        <View style={styles.row} key={`row-${i}`}>
          {rowCards.map((card, index) => renderCard(card, i + index))}
        </View>
      );
    }
    return rows;
  };

  return (
    <>
      <GamePopupModal
        visible={showIntro}
        imageSrc={require("../assets/images/shopowners/happytarot.png")}
        message={"I am the tarot card fish"}
        onClose={() => {
          setShowIntro(false);
          setShowRules(true);
        }}
      />
      <GamePopupModal
        visible={showRules}
        imageSrc={require("../assets/images/shopowners/happytarot.png")}
        message={"Find three pairs to reveal your destiny!"}
        onClose={() => setShowRules(false)}
      />
      {!showIntro && !showRules && (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Flip cards to find 3 matching pairs:</Text>
          {renderRows()}
          <Text style={styles.feedback}>{feedback}</Text>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontFamily: "Cinzel_900Black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginVertical: 4,
  },
  card: {
    width: 70,
    height: 70,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  feedback: {
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
});
