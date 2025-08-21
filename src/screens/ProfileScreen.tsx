// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { COLORS } from "../theme/colors";
import { useAppSelector } from "../store/hooks";
import { db } from "../services/firebase";
import { ref, get, set } from "firebase/database";
import { getCurrentLocation } from "../services/location";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const user = useAppSelector((s) => (s as any).auth?.user ?? null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<string | null>(null);
  // Guardamos un Data URI (o la uri local) en photoURL para no usar Storage pago
  const [photoURL, setPhotoURL] = useState<string | undefined>(undefined);
  const email = user?.email ?? "—";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!user?.uid) return;
        const snap = await get(ref(db, `users/${user.uid}/profile`));
        if (!mounted) return;
        if (snap.exists()) {
          const p = snap.val() || {};
          setName(p.name ?? "");
          setPhone(p.phone ?? "");
          setAddress(p.address ?? null);
          setPhotoURL(p.photoURL ?? undefined);
        }
      } catch (e: any) {
        console.warn("load profile error:", e?.message);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  const handleGetLocation = async () => {
    try {
      const loc: any = await getCurrentLocation();
      const label =
        typeof loc === "string"
          ? loc
          : loc?.address || loc?.label || loc?.formattedAddress || "";
      if (!label) throw new Error("No se pudo obtener la dirección.");
      setAddress(label);
    } catch (e: any) {
      Alert.alert("Ubicación", e?.message ?? "No se pudo obtener la ubicación.");
    }
  };

  // 👉 Elegir foto desde galería (gratis, sin Storage)
  const handlePickPhoto = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("Permisos", "Necesitamos permiso para acceder a tus fotos.");
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,     // recorte
        aspect: [1, 1],          // cuadrado
        quality: 0.6,            // reduce tamaño
        base64: true,            // para guardar como Data URI
      });

      if (!res.canceled && res.assets?.length) {
        const a = res.assets[0];
        if (a.base64) {
          const mime = a.type ? `image/${a.type}` : "image/jpeg";
          const dataUri = `data:${mime};base64,${a.base64}`;
          setPhotoURL(dataUri);
        } else {
          setPhotoURL(a.uri); // fallback (uri local)
        }
      }
    } catch (e: any) {
      Alert.alert("Foto", e?.message ?? "No se pudo seleccionar la imagen.");
    }
  };

  const handleSave = async () => {
    try {
      if (!user?.uid) {
        Alert.alert("Perfil", "Necesitás iniciar sesión para guardar.");
        return;
      }
      const path = ref(db, `users/${user.uid}/profile`);
      await set(path, {
        name: name.trim(),
        phone: phone.trim(),
        address: address ?? "",
        photoURL: photoURL ?? "",
        email: user.email ?? "",
        updatedAt: Date.now(),
      });
      Alert.alert("Perfil", "Datos guardados ✅");
    } catch (e: any) {
      Alert.alert("Perfil", e?.message ?? "No se pudo guardar.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.h1}>Mi perfil</Text>
      <Text style={styles.email}>Email: {email}</Text>

      <View style={styles.row}>
        <View style={styles.avatar}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatarImg} />
          ) : (
            <Text style={{ fontSize: 28 }}>👩‍🍳</Text>
          )}
        </View>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <TextInput
            placeholder="Nombre y apellido"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TextInput
            placeholder="Teléfono"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
        <Pressable
          onPress={handlePickPhoto}
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.btnText}>Elegir foto</Text>
        </Pressable>

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [styles.btnOutline, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.btnOutlineText}>Guardar perfil</Text>
        </Pressable>
      </View>

      <Text style={[styles.h2, { marginTop: 24 }]}>Mi ubicación</Text>
      <Text style={styles.address}>
        {address ? `📍 ${address}` : "Sin ubicación guardada"}
      </Text>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
        <Pressable
          onPress={handleGetLocation}
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.btnText}>Obtener ubicación</Text>
        </Pressable>

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [styles.btnOutline, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.btnOutlineText}>Guardar en Firebase</Text>
        </Pressable>
      </View>

      <Text style={[styles.h2, { marginTop: 24 }]}>Mis órdenes</Text>
      <Text style={{ color: "#444" }}>Todavía no tenés órdenes.</Text>

      <Pressable
        onPress={() =>
          Alert.alert("Sesión", "Implementá el cierre de sesión donde prefieras.")
        }
        style={({ pressed }) => [styles.btnGhost, pressed && { opacity: 0.8 }]}
      >
        <Text style={styles.btnGhostText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  h1: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 32,
    color: COLORS.rojo,
    marginBottom: 8,
  },
  email: { color: "#333", marginBottom: 16 },
  h2: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 22,
    color: COLORS.rojo,
    marginBottom: 6,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: { width: 70, height: 70, borderRadius: 35 },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  address: { color: "#333" },
  btn: {
    backgroundColor: COLORS.naranja,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: COLORS.rojo,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnOutlineText: { color: COLORS.rojo, fontWeight: "700" },
  btnGhost: {
    borderWidth: 1,
    borderColor: "#d9b0a3",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  btnGhostText: { color: COLORS.rojo, fontWeight: "700", textAlign: "center" },
});
