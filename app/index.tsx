// app/index.tsx

import { useGame } from "@/context/GameContext";
import { Player, Room } from "@/types/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏬 Explore the Market</Text>
      <FlatList
        data={rooms}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.roomCard,
              { backgroundColor: item.color, opacity: item.unlocked ? 1 : 0.4 },
            ]}
            onPress={() => handleRoomPress(item)}
            disabled={!item.unlocked}
          >
            <Text style={styles.roomText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Who’s solving this room?</Text>
            {players.map((player) => (
              <TouchableOpacity
                key={player.id}
                style={[styles.playerButton, { backgroundColor: player.color }]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  roomCard: {
    flex: 1,
    margin: 8,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  roomText: {
    fontWeight: "bold",
    fontSize: 18,
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
});
