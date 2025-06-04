import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GamePopupModal from "./GamePopUpModal";
type Option = {
  region: string;
  image: any;
};

type Postcard = {
  id: string;
  image: any;
  answer: string;
};

// 🖼️ Postcard image + correct region
const postcards: Postcard[] = [
  {
    id: "newyork",
    image: require("@/assets/images/postcards/newyork.png"),
    answer: "New York",
  },
  {
    id: "sanfrancisco",
    image: require("@/assets/images/postcards/sf.png"),
    answer: "California",
  },
  {
    id: "tokyo",
    image: require("@/assets/images/postcards/tokyo.png"),
    answer: "Japan",
  },
  {
    id: "london",
    image: require("@/assets/images/postcards/london.png"),
    answer: "United Kingdom",
  },
  {
    id: "paris",
    image: require("@/assets/images/postcards/paris.png"),
    answer: "France",
  },
  {
    id: "china",
    image: require("@/assets/images/postcards/china.png"),
    answer: "China",
  },
  {
    id: "greece",
    image: require("@/assets/images/postcards/greece.png"),
    answer: "Greece",
  },
];

const allRegions = postcards.map((p) => p.answer);

// 🧭 Silhouette image map
const silhouettes: Record<string, any> = {
  "New York": require("@/assets/images/silhouettes/ny.png"),
  California: require("@/assets/images/silhouettes/ca.png"),
  Japan: require("@/assets/images/silhouettes/japan.png"),
  "United Kingdom": require("@/assets/images/silhouettes/uk.png"),
  France: require("@/assets/images/silhouettes/france.png"),
  China: require("@/assets/images/silhouettes/china.png"),
  Greece: require("@/assets/images/silhouettes/greece.png"),
};

type Props = {
  onWin: () => void;
  onFail: () => void;
};

export default function SouvenirGame({ onWin, onFail }: Props) {
  const [shuffled, setShuffled] = useState<Postcard[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    const copy = [...postcards];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffled(copy);
  }, []);

  const current = shuffled[index];

  const getOptions = (): Option[] => {
    if (!current) return [];
    const others = allRegions.filter((r) => r !== current.answer);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 2);
    const choices = [current.answer, ...shuffledOthers].sort(
      () => 0.5 - Math.random()
    );
    return choices.map((region) => ({ region, image: silhouettes[region] }));
  };

  const handleGuess = (choice: string) => {
    const correct = choice === current.answer;

    if (correct) {
      const newScore = score + 1;
      setScore(newScore);

      if (newScore >= 3) {
        setFinished(true);
        onWin();
        return;
      }
    }

    if (index + 1 === postcards.length) {
      setFinished(true);
      if (score + (correct ? 1 : 0) < 3) onFail();
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (finished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📬 Game Over</Text>
        <Text style={styles.subtitle}>
          You matched {score} out of {postcards.length} correctly.
        </Text>
      </View>
    );
  }

  const options = getOptions();

  if (!current) return <></>;
  return (
    <>
      <GamePopupModal
        visible={showIntro}
        imageSrc={require("../assets/images/shopowners/happysouvenir.png")}
        message={
          "I am the souvenir shop fish, and my postcard display is a mess!"
        }
        onClose={() => {
          setShowIntro(false);
          setShowRules(true);
        }}
      />

      <GamePopupModal
        visible={showRules}
        imageSrc={require("../assets/images/shopowners/happysouvenir.png")}
        message={"Help me put my postcards back where they belong!"}
        onClose={() => setShowRules(false)}
      />

      {!showIntro && !showRules && (
        <View style={styles.container}>
          <Text style={styles.title}>Where is this postcard from?</Text>
          <Image source={current.image} style={styles.postcard} />

          <View style={styles.optionRow}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.region}
                onPress={() => handleGuess(option.region)}
                style={styles.smallSilhouetteBox}
              >
                <Image source={option.image} style={styles.smallSilhouette} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  postcard: {
    width: 280,
    height: 180,
    resizeMode: "contain",
    marginBottom: 24,
    borderRadius: 12,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  options: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
  },
  silhouetteBox: {
    backgroundColor: "#fff",
    padding: 12,
    margin: 8,
    borderRadius: 16,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  silhouette: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },

  smallSilhouetteBox: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 12,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: "center",
  },

  smallSilhouette: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
});
