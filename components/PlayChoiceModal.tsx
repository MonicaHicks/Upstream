import { Cinzel_900Black } from "@expo-google-fonts/cinzel/900Black";
import { useFonts } from "@expo-google-fonts/cinzel/useFonts";
import {
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PlayChoiceModalProps = {
  visible: boolean;
  imageSrc: ImageSourcePropType;
  message: string;
  onClose: (choice: "riddle" | "game") => void;
};

export default function PlayChoiceModal({
  visible,
  onClose,
  imageSrc,
  message,
}: PlayChoiceModalProps) {
  let [fontsLoaded] = useFonts({
    Cinzel_900Black,
  });
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Image source={imageSrc} style={styles.image} />
          <Text style={styles.text}>{message}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onClose("game")}
          >
            <Text style={styles.buttonText}>Try Again?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onClose("riddle")}
          >
            <Text style={styles.buttonText}>Solve a Riddle</Text>
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
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Cinzel_900Black",
  },
});
