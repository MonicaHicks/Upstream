import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [timeLeft, setTimeLeft] = useState(25);
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
    setTimeLeft(25);
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
          <Image
            source={require("../assets/images/pub1.png")}
            style={styles.fishImage}
          />
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
        <Text style={styles.menu}>MENU</Text>
        <Text style={styles.timer}>Timer: {timeLeft}s</Text>
        {selectedWords.map((word, index) => (
          <View key={index} style={styles.wordRow}>
            <Text style={styles.scrambled}>
              {index + 1}. {word.scrambled}
            </Text>
            <TextInput
              style={styles.input}
              value={inputs[index]}
              onChangeText={(text) => handleInputChange(text, index)}
              maxLength={word.answer.length}
              autoCapitalize="characters"
            />
          </View>
        ))}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Done!</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.bubbleCutoff}>🍻 You're cut off!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#DFA4E4",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 0,
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
  menu: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 50,
  },
  timer: {
    fontSize: 20,
    marginBottom: 20,
  },
  wordRow: {
    marginBottom: 20,
    alignItems: "center",
  },
  scrambled: {
    fontSize: 20,
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 2,
    borderColor: "black",
    fontSize: 20,
    textAlign: "center",
    minWidth: 100,
  },
  button: {
    marginTop: 0,
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
    flexDirection: "row-reverse", // flips the order: text left, fish right
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  fishImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginTop: 150,
    marginLeft: 16,
  },
});
