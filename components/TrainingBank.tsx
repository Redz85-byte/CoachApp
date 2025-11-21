import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

export default function TrainingBank() {

    // Haetaan kameran luvat
    const [permission, requestPermission] = useCameraPermissions();
    const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [photo, setPhoto] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null);

    // Haetaan gallerian luvat (tämä on OK)
    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === "granted");
        })();
    }, []);

    // Kamera-lupa latautuu
    if (!permission) {
        return <View />;
    }

    // Kamera-lupa ei ole myönnetty
    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text>Kameran käyttöoikeus tarvitaan.</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Salli kamera</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const themes = [
        {
            title: "Pelinavaaminen",
            exercises: ["Rakentelu alhaalta", "Linjojen väliin pelaaminen", "3v2 pelinavaus"],
        },
        {
            title: "Tilanteenvaihdot",
            exercises: ["Nopea vastaisku", "Pallonmenetyksen jälkeinen prässi", "Paluu muotoon"],
        },
        {
            title: "Korkea prässi & keskimatala blokki",
            exercises: ["Yhdistelmäprässi", "Keskiblokin liikkuminen", "Prässin ajoitus"],
        },
    ];

    const takePicture = async () => {
        if (!cameraRef.current) return;

        try {
            const pic = await cameraRef.current.takePictureAsync({ quality: 1 });
            setPhoto(pic.uri);
            setCameraActive(false);
        } catch (e) {
            console.log("Camera error:", e);
        }
    };

    const pickImage = async () => {
        if (!hasGalleryPermission) {
            Alert.alert("Tarvitaan lupa käyttää galleriaa!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });


        if (!result.canceled) setPhoto(result.assets[0].uri);
    };

    return (
        <>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Harjoituspankki</Text>

                {themes.map((theme) => (
                    <View key={theme.title} style={styles.card}>
                        <TouchableOpacity
                            onPress={() => setExpanded(expanded === theme.title ? null : theme.title)}
                        >
                            <Text style={styles.cardTitle}>{theme.title}</Text>
                        </TouchableOpacity>

                        {expanded === theme.title && (
                            <View style={styles.exerciseList}>
                                {theme.exercises.map((ex, i) => (
                                    <Text key={i} style={styles.exerciseItem}>
                                        {ex}
                                    </Text>
                                ))}

                                {photo && <Image source={{ uri: photo }} style={styles.preview} />}

                                <TouchableOpacity style={styles.button} onPress={() => setCameraActive(true)}>
                                    <Text style={styles.buttonText}>Avaa kamera</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.button} onPress={pickImage}>
                                    <Text style={styles.buttonText}>Valitse kuva galleriasta</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            <Modal visible={cameraActive} animationType="slide">
                <View style={{ flex: 1, backgroundColor: "#000" }}>
                    <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing="back"
                    />

                    <View style={{ padding: 20 }}>
                        <TouchableOpacity style={styles.button} onPress={takePicture}>
                            <Text style={styles.buttonText}>Ota kuva</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: "#888" }]}
                            onPress={() => setCameraActive(false)}
                        >
                            <Text style={styles.buttonText}>Sulje kamera</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#00adf5", marginBottom: 6 },
  exerciseList: { marginTop: 10 },
  exerciseItem: { fontSize: 16, marginBottom: 6, color: "#333" },
  button: {
    backgroundColor: "#00adf5",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  camera: { flex: 1 },
  preview: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "#fff", 
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  eventName: { fontWeight: "bold", fontSize: 16 },
  link: { color: "#007AFF", marginTop: 4 },
  noEvent: { textAlign: "center", marginTop: 20, color: "#666" },
});