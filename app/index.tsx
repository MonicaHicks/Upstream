// app/index.tsx

import { useGame } from "@/context/GameContext";
import { Player, Room } from "@/types/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
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
      <Text style={styles.header}>Upstream</Text>
      <FlatList
        data={rooms}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.roomCard, { opacity: item.unlocked ? 1 : 0.4 }]}
            onPress={() => handleRoomPress(item)}
            disabled={!item.unlocked}
          >
            <Image source={item.image} style={styles.roomImage} />
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
    backgroundColor: "#174873",
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
    height: 150,
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
  },
  roomText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "100%",
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
});
