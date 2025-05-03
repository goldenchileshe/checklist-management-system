import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

interface ImageEditorProps {
  imageUri: string;
  onDone: (editedUri: string) => void;
  onCancel: () => void;
}

const enhancementOptions = [
  { label: "Original", actions: [] },
  { label: "B&W", actions: [{ saturate: 0 }] },
  { label: "Lighten", actions: [{ resize: { width: 1000 } }] }, // Simulate a simple action to trigger manipulation
];

const ImageEditor: React.FC<ImageEditorProps> = ({
  imageUri,
  onDone,
  onCancel,
}) => {
  const [selected, setSelected] = useState("Original");
  const [previewUri, setPreviewUri] = useState(imageUri);
  const [loading, setLoading] = useState(false);

  const applyFilter = async (label: string, actions: any[]) => {
    try {
      setSelected(label);
      setLoading(true);

      if (actions.length === 0) {
        setPreviewUri(imageUri);
        return;
      }

      const result = await manipulateAsync(imageUri, actions, {
        format: SaveFormat.JPEG,
      });

      setPreviewUri(result.uri);
    } catch (error) {
      console.error("❌ Filter error:", error);
      Alert.alert("Error applying filter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crop + Enhance</Text>
      <Image source={{ uri: previewUri }} style={styles.image} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.optionsScroll}
      >
        {enhancementOptions.map(({ label, actions }) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.optionButton,
              selected === label && styles.optionActive,
            ]}
            onPress={() => applyFilter(label, actions)}
          >
            <Text
              style={[
                styles.optionText,
                selected === label && styles.optionTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDone(previewUri)}
          style={styles.doneBtn}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImageEditor;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black", padding: 20 },
  header: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    resizeMode: "contain",
  },
  optionsScroll: { marginTop: 20, marginBottom: 10 },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#333",
    borderRadius: 10,
    marginRight: 10,
  },
  optionActive: { backgroundColor: "white" },
  optionText: { color: "white", fontSize: 14 },
  optionTextActive: { color: "black", fontWeight: "bold" },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: { padding: 12, backgroundColor: "#900", borderRadius: 10 },
  doneBtn: { padding: 12, backgroundColor: "#4caf50", borderRadius: 10 },
  cancelText: { color: "white", fontWeight: "bold" },
  doneText: { color: "white", fontWeight: "bold" },
});
