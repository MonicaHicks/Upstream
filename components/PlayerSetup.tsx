import { useGame } from "@/context/GameContext";
import { clueSets } from "@/data/clues";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upstream</Text>
      <Text style={styles.title}>Enter Player Names</Text>
      <FlatList
        data={playerNames}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <TextInput
            style={styles.input}
            placeholder={`Player ${index + 1}`}
            placeholderTextColor="#aaa"
            value={item}
            onChangeText={(text) => handleNameChange(index, text)}
          />
        )}
      />
      <TouchableOpacity style={styles.button} onPress={handleStartGame}>
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {clueSummary.map((line, i) => (
              <Text key={i} style={styles.clueText}>
                {line}
              </Text>
            ))}
            <Text style={styles.popup}> Enter at least 2 players</Text>
            <TouchableOpacity
              onPress={handleContinue}
              style={[styles.button, { marginTop: 20 }]}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 16 },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginTop: 20,
    fontSize: 40,
  },
  input: {
    color: "white",
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  button: {
    backgroundColor: "#000080",
    padding: 14,
    borderRadius: 8,
  },
  popup: {
    fontSize: 25,
    color: "#000",
  },
  buttonText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
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
    marginBottom: 8,
    textAlign: "center",
  },
});
