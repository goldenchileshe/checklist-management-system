import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CapturePreviewProps {
  photoUri: string;
  onRetake: () => void;
  onConfirm: () => void;
}

const CapturePreview: React.FC<CapturePreviewProps> = ({
  photoUri,
  onRetake,
  onConfirm,
}) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.previewImage} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onRetake}
          style={[styles.button, styles.retakeButton]}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onConfirm}
          style={[styles.button, styles.confirmButton]}
        >
          <Text style={styles.buttonText}>Use Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CapturePreview;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  previewImage: { flex: 1, resizeMode: "contain", marginVertical: 20 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  button: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  retakeButton: { backgroundColor: "#f44336" },
  confirmButton: { backgroundColor: "#4caf50" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
