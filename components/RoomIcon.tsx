import { Room } from "@/types/types";
import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  item: Room;
  handleRoomPress: any;
}

export default function RoomIcon({ item, handleRoomPress }: Props) {
  let [fontsLoaded] = useFonts({
    Cinzel_900Black,
  });

  return (
    <View>
      <TouchableOpacity
        style={styles.roomCard}
        onPress={() => handleRoomPress(item)}
        disabled={!item.unlocked}
      >
        <Image source={item.image} style={styles.roomImage} />
        <Text style={styles.roomText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  roomCard: {
    width: 160,
    height: 160,
    margin: 0,
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  roomImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    opacity: 1,
    borderRadius: "50%",
    height: "80%",
    width: "90%",
    borderWidth: 3,
    borderColor: "#090b29",
  },
  roomText: {
    fontWeight: "bold",
    fontFamily: "Cinzel_900Black",
    fontSize: 18,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "80%",
    textAlign: "center",
    paddingVertical: 8,
    borderRadius: "20%",
  },
});
