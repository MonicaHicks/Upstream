// components/GamePopupModal.tsx
import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function GamePopupModal({
  visible,
  onClose,
  imageSrc,
  message,
  buttonText = "Continue",
}: {
  visible: boolean;
  onClose: () => void;
  imageSrc: any; // require() path or imported image
  message: string;
  buttonText?: string;
}) {
  let [fontsLoaded] = useFonts({
    Cinzel_900Black,
  });
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Image source={imageSrc} style={styles.image} />
          <Text style={styles.text}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 12,
    resizeMode: "contain",
    borderRadius: 30,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "Cinzel_900Black",
  },
  button: {
    backgroundColor: "#0099cc",
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Cinzel_900Black",
  },
});
