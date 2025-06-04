import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";
import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GamePopupModal from "./GamePopUpModal";

type Props = {
  onWin: () => void;
  onFail: () => void;
};

const dieEmojis = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export default function GamblingGame({ onWin, onFail }: Props) {
  const [choice, setChoice] = useState<"high" | "low" | null>(null);
  const [target, setTarget] = useState<number | null>(null);
  const [rolls, setRolls] = useState<number[]>([]);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [currentRoll, setCurrentRoll] = useState<number | null>(null);
  const [rollCount, setRollCount] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showRules, setShowRules] = useState(false);
  let [fontsLoaded] = useFonts({
    Cinzel_900Black,
  });
  const animation = useRef(new Animated.Value(0)).current;

  const rollDie = () => Math.floor(Math.random() * (5 - 2 + 1)) + 2;

  const animateRoll = () => {
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  const startGame = (userChoice: "high" | "low") => {
    const newTarget = rollDie();
    setChoice(userChoice);
    setTarget(newTarget);
    setRolls([]);
    setResult(null);
    setCurrentRoll(null);
    setRollCount(0);
  };

  const handleRoll = () => {
    if (rollCount >= 5 || rolling || result) return;

    setRolling(true);
    const rolled = rollDie();
    animateRoll();

    setTimeout(() => {
      const updatedRolls = [...rolls, rolled];
      setCurrentRoll(rolled);
      setRolls(updatedRolls);
      setRollCount((prev) => prev + 1);
      setRolling(false);

      if (choice && target !== null) {
        const successCount = updatedRolls.filter((r) =>
          choice === "high" ? r > target : r < target
        ).length;

        const remainingRolls = 5 - updatedRolls.length;
        const possibleMaxSuccess = successCount + remainingRolls;

        if (successCount >= 3) {
          setResult("win");
          onWin();
        } else if (possibleMaxSuccess < 3) {
          setResult("lose");
          onFail();
        }
      }
    }, 500);
  };

  const reset = () => {
    setChoice(null);
    setTarget(null);
    setRolls([]);
    setResult(null);
    setCurrentRoll(null);
    setRollCount(0);
    setRolling(false);
  };

  return (
    <>
      <GamePopupModal
        visible={showIntro}
        imageSrc={require("../assets/images/shopowners/happygamble.png")}
        message={"I am the gambling den fish"}
        onClose={() => {
          setShowIntro(false);
          setShowRules(true);
        }}
      />

      <GamePopupModal
        visible={showRules}
        imageSrc={require("../assets/images/shopowners/happygamble.png")}
        message={"Choose wisely and roll correctly to beat this game"}
        onClose={() => setShowRules(false)}
      />

      {!showIntro && !showRules && (
        <View style={styles.container}>
          {!choice ? (
            <>
              <Text style={styles.title}>Choose High or Low</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => startGame("high")}
                  style={[styles.button, { backgroundColor: "#44c" }]}
                >
                  <Text style={styles.buttonText}>High</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => startGame("low")}
                  style={[styles.button, { backgroundColor: "#c44" }]}
                >
                  <Text style={styles.buttonText}>Low</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.results}>
              <Text style={styles.text}>
                Roll {choice == "high" ? "above" : "under"} {target} three times
                to win
              </Text>
              <Text style={styles.diceText}>
                {rolls.map((r) => dieEmojis[r]).join(" ")}
              </Text>

              <Animated.Text
                style={[
                  styles.rollingText,
                  {
                    transform: [
                      {
                        rotate: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "360deg"],
                        }),
                      },
                      {
                        scale: animation.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [1, 1.5, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {rolling ? "🎲" : currentRoll ? dieEmojis[currentRoll] : "🎲"}
              </Animated.Text>

              {rollCount < 5 && !result && (
                <TouchableOpacity onPress={handleRoll} style={styles.button}>
                  <Text style={styles.buttonText}>
                    Roll Dice ({rollCount + 1}/5)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "Cinzel_900Black",
  },
  row: { flexDirection: "row", justifyContent: "space-around" },
  button: {
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: "#222",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Cinzel_900Black",
  },
  results: { alignItems: "center", gap: 12 },
  text: { fontSize: 16, fontFamily: "Cinzel_900Black" },
  diceText: { fontSize: 55 },
  rollingText: { fontSize: 75, fontFamily: "Cinzel_900Black", marginTop: 12 },
  resultText: {
    fontSize: 20,
    fontFamily: "Cinzel_900Black",
    fontWeight: "bold",
    marginTop: 16,
  },
});
