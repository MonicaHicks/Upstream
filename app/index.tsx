import RoomIcon from "@/components/RoomIcon";
import { useGame } from "@/context/GameContext";
import { Player, Room } from "@/types/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PlayerSetupScreen from "./setup";

export default function HomeScreen() {
  const { rooms, players, selectPlayer } = useGame();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleRoomPress = (room: Room) => {
    if (!room.unlocked) return;
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handlePlayerSelect = (player: Player) => {
    selectPlayer(player.id);
    setShowModal(false);
    router.push(`/room/${selectedRoom?.id}` as any);
  };

  // If players aren't set up yet, show setup screen
  if (players.length === 0) {
    return <PlayerSetupScreen />;
  }

  return (
    <ImageBackground
      source={require("../assets/images/Background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <Text
        style={{
          fontFamily: "Cinzel_900Black",
          fontSize: 50,
          color: "goldenrod",
          textAlign: "center",
          textShadowColor: "black",
          textShadowOffset: { width: 5, height: 5 },
          textShadowRadius: 10,
          marginTop: 50,
        }}
      >
        Upstream
      </Text>

      <ScrollView contentContainerStyle={styles.snakeContainer}>
        {rooms.map((item, index) => {
          const alignLeft = index % 2 === 0;
          return (
            <View
              key={item.id}
              style={[
                styles.snakeRow,
                { justifyContent: alignLeft ? "flex-start" : "flex-end" },
              ]}
            >
              <RoomIcon item={item} handleRoomPress={handleRoomPress} />
            </View>
          );
        })}

        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Who’s solving this room?</Text>
              {players.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  style={[
                    styles.playerButton,
                    { backgroundColor: player.color },
                  ]}
                  onPress={() => handlePlayerSelect(player)}
                >
                  <Text style={styles.playerText}>{player.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "white",
  },
  roomCard: {
    flex: 1,
    margin: 8,
    height: "50%",
    width: "20%",
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  roomImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    opacity: 0.8,
    resizeMode: "cover",
    width: "20%",
  },
  roomText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "20%",
    textAlign: "center",
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  playerButton: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    width: "100%",
    alignItems: "center",
  },
  playerText: {
    fontWeight: "bold",
    color: "black",
    fontSize: 16,
  },
  cancel: {
    marginTop: 12,
    color: "#888",
  },
  snakeContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  snakeRow: {
    flexDirection: "row",
    marginBottom: 0,
  },
});
