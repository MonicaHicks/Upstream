import { useGame } from "@/context/GameContext";
import { rooms } from "@/data/rooms";
import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

type Props = {
  onWin: () => void;
};

export default function OpenUpShop({ onWin }: Props) {
  const { currentPlayer } = useGame();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  let [fontsLoaded] = useFonts({
    Cinzel_900Black,
  });

  const visited = currentPlayer?.roomsVisited || [];
  const secret = currentPlayer?.secretGoal?.rooms || [];

  if (!currentPlayer || visited.length === 0) {
    return (
      <View>
        <Text
          style={{
            fontFamily: "Cinzel_900Black",
            textAlign: "center",
            fontSize: 24,
            color: "black",
          }}
        >
          You haven’t visited any rooms yet!
        </Text>

        <Text
          style={{
            textAlign: "center",
            marginTop: 18,
            fontSize: 24,
            color: "black",
            fontFamily: "Cinzel_900Black",
          }}
        >
          Your clue is: {currentPlayer?.secretGoal?.clue}
        </Text>
      </View>
    );
  }

  const toggleRoom = (roomId: string) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter((r) => r !== roomId));
    } else if (selectedRooms.length < 3) {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const handleSubmit = () => {
    const correctCount = selectedRooms.filter((r) => secret.includes(r)).length;
    setFeedback(`${correctCount} out of 3 correct`);

    if (correctCount === 3) {
      setShowConfetti(true);
      onWin();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontFamily: "Cinzel_900Black", fontSize: 30 }}>
        Your clue is: {currentPlayer?.secretGoal?.clue}
      </Text>
      <Text style={styles.title}>Select 3 rooms you think are your goal:</Text>

      <View
        style={{
          flexWrap: "wrap",
          justifyContent: "center",
          flexDirection: "row",
          gap: 6,
        }}
      >
        {rooms
          .filter((r) => visited.includes(r.id))
          .map((room) => (
            <TouchableOpacity
              key={room.id}
              onPress={() => toggleRoom(room.id)}
              style={{
                padding: 10,
                margin: 4,
                borderRadius: 8,
                backgroundColor: selectedRooms.includes(room.id)
                  ? "#4A90E2"
                  : "#ccc",
              }}
            >
              <Text>{room.name}</Text>
            </TouchableOpacity>
          ))}
      </View>

      <Text style={styles.subtitle}>
        Selected:{" "}
        {selectedRooms
          .map((id) => rooms.find((r) => r.id === id)?.name)
          .join(", ")}
      </Text>

      {feedback && <Text style={styles.result}>{feedback}</Text>}

      <TouchableOpacity
        style={[
          styles.button,
          { opacity: selectedRooms.length === 3 ? 1 : 0.4 },
        ]}
        disabled={selectedRooms.length < 1}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Check</Text>
      </TouchableOpacity>

      {showConfetti && (
        <ConfettiCannon
          count={80}
          origin={{ x: 200, y: -20 }}
          explosionSpeed={350}
          fadeOut
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 20 },
  title: {
    fontSize: 20,
    fontFamily: "Cinzel_900Black",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Cinzel_900Black",
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  button: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    fontFamily: "Cinzel_900Black",
    fontWeight: "bold",
    textAlign: "center",
  },
  result: {
    marginTop: 16,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Cinzel_900Black",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    color: "black",
  },
});
