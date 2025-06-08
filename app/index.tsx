import GamePopupModal from "@/components/GamePopUpModal";
import RoomIcon from "@/components/RoomIcon";
import { useGame } from "@/context/GameContext";
import { Player, Room } from "@/types/types";
import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  const [intro1, setIntro1] = useState(false);
  const [intro2, setIntro2] = useState(false);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasSeenIntro = await AsyncStorage.getItem("hasSeenIntro");
      if (!hasSeenIntro) {
        setIntro1(true);
        await AsyncStorage.setItem("hasSeenIntro", "true");
      }
    };

    checkFirstLaunch();
  }, []);

  let [fontsLoaded] = useFonts({
    Cinzel_900Black,
  });

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

      <GamePopupModal
        visible={intro1}
        onClose={() => {
          setIntro1(false);
          setIntro2(true);
        }}
        imageSrc={require("../assets/images/shopowners/happystevie.png")}
        message={
          "Welcome to Upstream!\n\nI’ve got an empty storefront in my fish market.\n\nDo you have what it takes to be a business owner?"
        }
      />

      <GamePopupModal
        visible={intro2}
        onClose={() => {
          setIntro2(false);
        }}
        imageSrc={require("../assets/images/shopowners/happystevie.png")}
        message={`Come visit me any time at "Open Up Shop" to see your hint or check on your progress.\n\nFirst one to fulfill their apprenticeships gets the keys!`}
        buttonText={"We're Ready!"}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setIntro1(true)}>
          <Text style={styles.buttonText}>Overview</Text>
        </TouchableOpacity>
      </View>

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
    fontFamily: "Cinzel_900Black",
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
    fontFamily: "Cinzel_900Black",
    textAlign: "center",
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
    fontFamily: "Cinzel_900Black",
  },
  cancel: {
    marginTop: 12,
    color: "#888",
    fontFamily: "Cinzel_900Black",
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
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#0099cc",
    padding: 10,
    borderRadius: 6,
    width: "25%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Cinzel_900Black",
    textAlign: "center",
  },
});
