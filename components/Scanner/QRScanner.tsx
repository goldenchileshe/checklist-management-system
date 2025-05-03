import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
  Alert,
  Image,
  BackHandler,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  CameraCapturedPicture,
  FlashMode,
} from "expo-camera";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import ImageEditor from "./ImageEditor";

interface QRScannerProps {
  onPhotoTaken: (photoUris: string[]) => void;
  onCancel: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onPhotoTaken, onCancel }) => {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);
  const [flash, setFlash] = useState<FlashMode>("off");
  const [captureMode, setCaptureMode] = useState<"single" | "batch">("single");
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [autoCapture, setAutoCapture] = useState(false);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const [soundEnabled, setSoundEnabled] = useState(false);
  const navigation = useNavigation();
  const [showEditor, setShowEditor] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const auto = await AsyncStorage.getItem("autoCapture");
      const orient = await AsyncStorage.getItem("orientation");
      const sound = await AsyncStorage.getItem("soundEnabled");
      if (auto !== null) setAutoCapture(auto === "true");
      if (orient === "landscape" || orient === "portrait")
        setOrientation(orient);
      if (sound !== null) setSoundEnabled(sound === "true");
    };
    loadSettings();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("autoCapture", autoCapture.toString());
  }, [autoCapture]);

  useEffect(() => {
    AsyncStorage.setItem("orientation", orientation);
  }, [orientation]);

  useEffect(() => {
    AsyncStorage.setItem("soundEnabled", soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoCapture && isReady && captureMode === "single") {
      timer = setTimeout(() => takePicture(), 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoCapture, isReady, captureMode]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (capturedPhotos.length > 0 || selectedImageUri) {
          Alert.alert(
            "Discard Scans",
            "Closing will discard the scans you captured!",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Discard",
                style: "destructive",
                onPress: () => {
                  setCapturedPhotos([]);
                  setSelectedImageUri(null);
                  onCancel();
                },
              },
            ]
          );
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [capturedPhotos, selectedImageUri]);

  const takePicture = async () => {
    if (cameraRef.current && isReady) {
      const photo: CameraCapturedPicture =
        await cameraRef.current.takePictureAsync();
      if (soundEnabled) {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/sounds/shutter.mp3")
        );
        await sound.playAsync();
      }
      setSelectedImageUri(photo.uri);
      setShowEditor(true);
    }
  };

  const handleDoneEditing = (editedUri: string) => {
    setShowEditor(false);
    setSelectedImageUri(editedUri);
    if (captureMode === "single") {
      setCapturedPhotos([editedUri]);
    } else {
      setCapturedPhotos((prev) => [...prev, editedUri]);
    }
  };

  const handleComplete = () => {
    if (capturedPhotos.length > 0) {
      onPhotoTaken(capturedPhotos);
    } else if (selectedImageUri) {
      onPhotoTaken([selectedImageUri]);
    }
  };

  if (!permission?.granted) {
    return (
      <Text style={styles.permissionText}>Camera permission is required.</Text>
    );
  }

  return (
    <View style={styles.container}>
      {showEditor && selectedImageUri ? (
        <ImageEditor
          imageUri={selectedImageUri}
          onDone={handleDoneEditing}
          onCancel={() => setShowEditor(false)}
        />
      ) : (
        <>
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => {
                if (capturedPhotos.length > 0 || selectedImageUri) {
                  Alert.alert(
                    "Discard Scans",
                    "Closing will discard the scans you captured!",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Discard",
                        style: "destructive",
                        onPress: () => {
                          setCapturedPhotos([]);
                          setSelectedImageUri(null);
                          onCancel();
                        },
                      },
                    ]
                  );
                } else {
                  navigation.goBack();
                }
              }}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setFlash((prev) => (prev === "off" ? "on" : "off"))
              }
            >
              <Ionicons
                name={flash === "off" ? "flash-off" : "flash"}
                size={28}
                color="white"
              />
            </TouchableOpacity>

            <View style={styles.modeToggles}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  captureMode === "single" && styles.modeButtonActive,
                ]}
                onPress={() => setCaptureMode("single")}
              >
                <Text
                  style={[
                    styles.modeText,
                    captureMode === "single" && styles.modeTextActive,
                  ]}
                >
                  Single
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  captureMode === "batch" && styles.modeButtonActive,
                ]}
                onPress={() => setCaptureMode("batch")}
              >
                <Text
                  style={[
                    styles.modeText,
                    captureMode === "batch" && styles.modeTextActive,
                  ]}
                >
                  Batch
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setShowSettings(true)}>
              <Entypo name="dots-three-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <CameraView
            ref={cameraRef}
            style={[
              styles.camera,
              orientation === "landscape" && styles.cameraLandscape,
            ]}
            flash={flash}
            facing="back"
            onCameraReady={() => setIsReady(true)}
          />

          <View style={styles.bottomBar}>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
            >
              <Ionicons name="camera" size={32} color="white" />
            </TouchableOpacity>

            {(captureMode === "batch" && capturedPhotos.length > 0) ||
            (captureMode === "single" && selectedImageUri) ? (
              <TouchableOpacity
                onPress={handleComplete}
                style={styles.completeButton}
              >
                <Text style={styles.completeText}>Complete</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {selectedImageUri && !showEditor && (
            <TouchableOpacity
              style={styles.previewFloating}
              onPress={() => setShowEditor(true)}
            >
              <Image
                source={{ uri: selectedImageUri }}
                style={styles.previewImage}
              />
              <Text style={styles.modifyText}>Modify</Text>
            </TouchableOpacity>
          )}

          <Modal visible={showSettings} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.settingsPanel}>
                <Text style={styles.settingsTitle}>More Options</Text>

                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Auto Capture</Text>
                  <Switch value={autoCapture} onValueChange={setAutoCapture} />
                </View>

                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Orientation</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setOrientation((prev) =>
                        prev === "portrait" ? "landscape" : "portrait"
                      )
                    }
                    style={styles.settingButton}
                  >
                    <Text style={styles.settingButtonText}>{orientation}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Sound</Text>
                  <Switch
                    value={soundEnabled}
                    onValueChange={setSoundEnabled}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setShowSettings(false)}
                  style={styles.closeSettings}
                >
                  <Text style={styles.completeText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

export default QRScanner;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  camera: { flex: 1 },
  cameraLandscape: { transform: [{ rotate: "90deg" }] },
  permissionText: {
    flex: 1,
    color: "white",
    textAlign: "center",
    marginTop: 100,
  },
  topBar: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modeToggles: { flexDirection: "row", gap: 10 },
  modeButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
    marginHorizontal: 5,
  },
  modeButtonActive: { backgroundColor: "white" },
  modeText: { color: "white", fontWeight: "bold", textTransform: "uppercase" },
  modeTextActive: { color: "black" },
  bottomBar: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#333",
    padding: 18,
    borderRadius: 50,
    marginHorizontal: 20,
  },
  completeButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  completeText: { color: "white", fontSize: 16, fontWeight: "bold" },
  previewFloating: {
    position: "absolute",
    bottom: 90,
    right: 20,
    alignItems: "center",
  },
  previewImage: { width: 50, height: 50, borderRadius: 8 },
  modifyText: { color: "white", marginTop: 5, fontSize: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsPanel: {
    width: "80%",
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 12,
  },
  settingsTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  settingLabel: { color: "white", fontSize: 16 },
  settingButton: {
    backgroundColor: "#444",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  settingButtonText: { color: "white", textTransform: "capitalize" },
  closeSettings: { marginTop: 20, alignSelf: "center", padding: 10 },
});
