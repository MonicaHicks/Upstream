import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GamePopupModal from "./GamePopUpModal";

const { width } = Dimensions.get("window");

const JAR_IMAGES = [
  require("@/assets/images/cafe/jar1.png"),
  require("@/assets/images/cafe/jar2.png"),
  require("@/assets/images/cafe/jar3.png"),
];

const BEAN_IMAGE = require("@/assets/images/cafe/1bean.png");

const BEAN_COUNTS = [1, 2, 3];
const JAR_COUNT = 3;
const TOTAL_DROPS = 9;

type Props = {
  onWin: () => void;
  onFail: () => void;
};

// Generate a random total bean count that is divisible by the number of jars
const getRandomTotalBeans = (): number => {
  const min = 15;
  const max = 24;
  const options = [];
  for (let i = min; i <= max; i++) {
    if (i % JAR_COUNT === 0) options.push(i);
  }
  return options[Math.floor(Math.random() * options.length)];
};

// Generate a list of bean drops that add up to the total bean count
const generateValidBeanDrops = (
  totalDrops: number,
  totalBeans: number
): number[] => {
  const drops: number[] = [];

  while (drops.length < totalDrops) {
    const remaining = totalDrops - drops.length;
    const usedBeans = drops.reduce((a, b) => a + b, 0);
    const remainingBeans = totalBeans - usedBeans;

    const maxThisDrop = Math.min(3, remainingBeans - (remaining - 1) * 1);
    const minThisDrop = Math.max(1, remainingBeans - (remaining - 1) * 3);

    const beanCount =
      Math.floor(Math.random() * (maxThisDrop - minThisDrop + 1)) + minThisDrop;
    drops.push(beanCount);
  }

  return drops;
};

export default function CafeGame({ onWin, onFail }: Props) {
  const [jars, setJars] = useState<number[]>(Array(JAR_COUNT).fill(0));
  const [currentBean, setCurrentBean] = useState<number | null>(null);
  const [drops, setDrops] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [beanDrops, setBeanDrops] = useState<number[]>([]);
  const [totalBeans, setTotalBeans] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [dropsLeft, setDropLeft] = useState(TOTAL_DROPS);

  useEffect(() => {
    const total = getRandomTotalBeans();
    setTotalBeans(total);
    const validDrops = generateValidBeanDrops(TOTAL_DROPS, total);
    setBeanDrops(validDrops);
    setCurrentBean(validDrops[0]);
  }, []);

  const dropNextBean = () => {
    if (drops + 1 >= TOTAL_DROPS) {
      const allEqual = jars.every((val) => val === jars[0]);
      setFeedback(allEqual ? "Perfectly balanced!" : "Uneven jars! Try again.");
      setTimeout(() => (allEqual ? onWin() : onFail()), 1200);
      return;
    }

    setCurrentBean(beanDrops[drops + 1]);
  };

  const handlePlace = (index: number) => {
    setDropLeft(dropsLeft - 1);
    if (currentBean === null) {
      console.log("null bean");
      return;
    }
    const newJars = [...jars];
    newJars[index] += currentBean;
    setJars(newJars);

    const nextDrop = drops + 1;
    setDrops(nextDrop);
    setCurrentBean(null);

    if (nextDrop >= TOTAL_DROPS) {
      const allEqual = newJars.every((val) => val === newJars[0]);
      setFeedback(
        allEqual ? "Perfectly balanced! ☕️" : "Uneven jars! Try again."
      );
      setTimeout(() => (allEqual ? onWin() : onFail()), 1200);
    } else {
      setTimeout(dropNextBean, 400);
    }
  };

  return (
    <>
      <GamePopupModal
        visible={showIntro}
        imageSrc={require("../assets/images/shopowners/happycafe.png")}
        message={
          "Welcome to my cafe!\n\nBeing a shopowner requires planning and organization.\n\nIf you're not thinking ahead, you're falling behind."
        }
        onClose={() => {
          setShowIntro(false);
          setShowRules(true);
        }}
      />
      <GamePopupModal
        visible={showRules}
        imageSrc={require("../assets/images/shopowners/happycafe.png")}
        message={
          "Click on a jar to deposit the group of beans into it.\n\nAfter 9 drops, the jars must be completely even.\n\nLet's see what you've got!"
        }
        onClose={() => setShowRules(false)}
      />
      {!showIntro && !showRules && (
        <View style={styles.container}>
          <Text style={styles.title}>Distribute the coffee beans evenly!</Text>
          <View style={styles.jarsRow}>
            {jars.map((count, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  handlePlace(index);
                }}
              >
                <Image source={JAR_IMAGES[index]} style={styles.jarImage} />
                <Text style={styles.beanCountText}>{count} beans</Text>
              </TouchableOpacity>
            ))}
          </View>
          {currentBean !== null && (
            <View style={styles.beanBox}>
              <Text style={styles.beanLabel}>Drop: {currentBean}</Text>
              <View style={styles.beanRow}>
                {Array.from({ length: currentBean }).map((_, i) => (
                  <Image key={i} source={BEAN_IMAGE} style={styles.beanImage} />
                ))}
              </View>
            </View>
          )}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.beanLabel}>{dropsLeft} Drops Left</Text>
          </View>
          {feedback && <Text style={styles.feedback}>{feedback}</Text>}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#6b4c32",
    textAlign: "center",
  },
  jarsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 85,
    marginBottom: 40,
  },
  jarImage: {
    width: width / 4,
    height: width / 4,
    resizeMode: "contain",
    marginHorizontal: 10,
  },
  beanCountText: {
    textAlign: "center",
    marginTop: 4,
    fontWeight: "bold",
    fontSize: 16,
    color: "#6b4c32",
  },
  beanBox: {
    alignItems: "center",
    backgroundColor: "#f9ede3",
    padding: 12,
    borderRadius: 8,
    borderColor: "#ddb892",
    borderWidth: 1,
  },
  beanLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#6b4c32",
  },
  beanRow: {
    flexDirection: "row",
  },
  beanImage: {
    width: 30,
    height: 38,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  feedback: {
    fontSize: 18,
    marginTop: 30,
    color: "#6b4c32",
    fontWeight: "bold",
    textAlign: "center",
  },
});
