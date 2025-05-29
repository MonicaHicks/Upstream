import { useGame } from "@/context/GameContext";
import { clueSets } from "@/data/clues";
import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";
import { useRouter } from "expo-router";
import { useState } from "react";

import {
  FlatList,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PlayerSetupScreen() {
  const { setPlayers } = useGame();
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", "", ""]);
  const [showModal, setShowModal] = useState(false);
  const [clueSummary, setClueSummary] = useState<string[]>([]);
  const router = useRouter();

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    const validNames = playerNames.filter((n) => n.trim() !== "");
    const shuffledClues = [...clueSets].sort(() => 0.5 - Math.random());

    const newPlayers = validNames.map((name, index) => ({
      id: `player-${index + 1}`,
      name,
      color: ["#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF"][index % 4],
      roomsVisited: [],
      challengesSolved: [],
      secretGoal: shuffledClues[index],
    }));

    setPlayers(newPlayers);
    setClueSummary(
      newPlayers.map((p) => `${p.name}, your clue is: ${p.secretGoal.clue}`)
    );
    setShowModal(true);
  };

  const handleContinue = () => {
    setShowModal(false);
    requestAnimationFrame(() => {
      router.replace("/");
    });
  };
  let [fontsLoaded] = useFonts({
    Cinzel_900Black,
  });

  return (
    <ImageBackground
      source={require("../assets/images/Background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <Text
        style={{
          fontFamily: "Cinzel_900Black",
          fontSize: 70,
          color: "goldenrod",
          textAlign: "center",
          textShadowColor: "black",
          textShadowOffset: { width: 5, height: 5 },
          textShadowRadius: 10,
          marginTop: 200,
        }}
      >
        Upstream
      </Text>
      <View style={styles.overlay}>
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontFamily: "Cinzel_900Black",
            fontSize: 30,
            textAlign: "center",
          }}
        >
          Enter Player Names
        </Text>
        <FlatList
          data={playerNames}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <TextInput
              style={styles.input}
              placeholder={`Player ${index + 1}`}
              placeholderTextColor="#000"
              value={item}
              onChangeText={(text) => handleNameChange(index, text)}
            />
          )}
        />
        <TouchableOpacity style={styles.button} onPress={handleStartGame}>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontFamily: "Cinzel_900Black",
              fontSize: 30,
              textAlign: "center",
            }}
          >
            Start Game
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {clueSummary.map((line, i) => (
              <Text key={i} style={styles.clueText}>
                {line}
              </Text>
            ))}
            <Text style={styles.popup}>Enter at least 2 players</Text>
            <TouchableOpacity
              onPress={handleContinue}
              style={[styles.button, { marginTop: 20 }]}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "60%",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Cinzel_900Black",
    marginBottom: 20,
  },
  input: {
    color: "#000",
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    backgroundColor: "rgba(255,255,255,0.4)",
    fontWeight: "bold",
    fontFamily: "Cinzel_900Black",
  },
  button: {
    backgroundColor: "#000080",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 25,
    fontFamily: "Cinzel_900Black",
    fontWeight: "bold",
    textAlign: "center",
  },
  popup: {
    fontSize: 25,
    fontFamily: "Cinzel_900Black",
    color: "#000",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  clueText: {
    fontSize: 16,
    fontFamily: "Cinzel_900Black",
    marginBottom: 8,
    textAlign: "center",
  },
});
