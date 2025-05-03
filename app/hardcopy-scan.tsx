import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import QRScanner from "../components/Scanner/QRScanner";

const HardcopyScanScreen = () => {
  const [photoUris, setPhotoUris] = useState<string[] | null>(null);
  const [scannerKey, setScannerKey] = useState(0); // force remount of scanner

  const handlePhotoTaken = (uris: string[]) => {
    console.log("✅ handlePhotoTaken", uris);
    setPhotoUris(uris);
  };

  const handleRetake = () => {
    console.log("✅ handleRetake called");
    setPhotoUris(null);
    setScannerKey((prev) => prev + 1);
  };

  console.log("📷 Current photoUris:", photoUris);

  return (
    <View style={styles.container}>
      {!photoUris ? (
        <QRScanner
          key={scannerKey}
          onPhotoTaken={handlePhotoTaken}
          onCancel={handleRetake}
        />
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Captured {photoUris.length} photo(s)
          </Text>
        </View>
      )}
    </View>
  );
};

export default HardcopyScanScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  resultContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
