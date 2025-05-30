import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import pubmenu from "../assets/images/pubmenu.png";

const fullWordList = [
  { scrambled: "AVITIR", answer: "TRIVIA" },
  { scrambled: "REBE", answer: "BEER" },
  { scrambled: "RAFCT", answer: "CRAFT" },
  { scrambled: "REDIC", answer: "CIDER" },
  { scrambled: "MOFA", answer: "FOAM" },
  { scrambled: "SKWYIHE", answer: "WHISKEY" },
  { scrambled: "TISSRIP", answer: "SPIRITS" },
];

function getRandomSubset<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}

type Props = {
  onWin: () => void;
  onFail: () => void;
};

export default function AnagramGame({ onWin, onFail }: Props) {
  const [step, setStep] = useState<"intro" | "game" | "done">("intro");
  const [inputs, setInputs] = useState(["", ""]);
  const [timeLeft, setTimeLeft] = useState(100);
  const [selectedWords, setSelectedWords] = useState(() =>
    getRandomSubset(fullWordList, 2)
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "game" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setStep("done");
    }
    return () => clearTimeout(timer);
  }, [step, timeLeft]);

  const handleStart = () => {
    setSelectedWords(getRandomSubset(fullWordList, 2));
    setInputs(["", ""]);
    setTimeLeft(100);
    setStep("game");
  };

  const handleInputChange = (text: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = text.toUpperCase();
    setInputs(newInputs);
  };

  const handleSubmit = () => {
    const correct = inputs.every(
      (input, i) => input === selectedWords[i].answer.toUpperCase()
    );
    if (correct) {
      onWin();
    } else {
      setStep("done");
      onFail();
    }
  };

  if (step === "intro") {
    return (
      <View style={styles.screen}>
        <View style={styles.introRow}>
          <Text style={styles.bubbleIntro}>
            You want a token?{"\n"}Gotta earn it.{"\n\n"}If you're too drunk to
            read the menu,{"\n"}I'll cut you off!
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>I’m Ready!</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === "game") {
    return (
      <View style={styles.screen}>
        <Image source={pubmenu} style={styles.backgroundImage} />
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>⏳ {timeLeft}s</Text>
        </View>
        <View style={styles.wordOverlayContainer}>
          {selectedWords.map((word, index) => (
            <View key={index} style={styles.wordRowOverlay}>
              <Text style={styles.scrambled}>{word.scrambled}</Text>
              <TextInput
                style={styles.input}
                value={inputs[index]}
                onChangeText={(text) => handleInputChange(text, index)}
                maxLength={word.answer.length}
                autoCapitalize="characters"
              />
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.serveButton} onPress={handleSubmit}>
          <Text style={styles.serveText}>SERVE</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Image source={pubmenu} style={styles.backgroundImage} />
      <Text style={styles.bubbleCutoff}>🍻 You're cut off!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  timerBadge: {
    position: "absolute",
    top: 60,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#FFA726",
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF8C00",
  },
  scrambled: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },

  input: {
    marginTop: 12,
    borderBottomWidth: 3,
    borderColor: "white",
    fontSize: 24,
    color: "white",
    textAlign: "center",
    width: 120,
  },

  wordRowOverlay: {
    marginBottom: 20,
    alignItems: "center",
  },
  wordOverlayContainer: {
    marginTop: 450,
    width: "100%",
    bottom: 218,
    alignItems: "center",
  },

  serveButton: {
    position: "absolute",
    bottom: 80,
    backgroundColor: "#FFA726",
    borderRadius: 40,
    paddingHorizontal: 40,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
  },
  serveText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  bubbleIntro: {
    backgroundColor: "#994DDB",
    color: "white",
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    marginBottom: 30,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "#EED6FF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B0082",
  },
  introRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  bubbleCutoff: {
    backgroundColor: "#994DDB",
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "center",
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
