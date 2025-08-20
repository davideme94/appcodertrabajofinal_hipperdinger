import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert, FlatList, Image,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setError, setLoading, signOut as signOutLocal } from "../features/auth/authSlice";
import { COLORS } from "../theme/colors";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as fbSignOut,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { subscribeOrders, type Order } from "../services/orders";
import { getCurrentLocation } from "../services/location";
import { setLocation } from "../features/location/locationSlice";
import {
  saveUserLocation,
  saveUserProfile,
  subscribeUserProfile,
  uploadUserAvatarBase64,
  type UserProfile,
} from "../services/users";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((s) => s.auth);
  const loc = useAppSelector((s) => s.location);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // Perfil
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null); // url o base64
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Órdenes y ubicación
  const [orders, setOrders] = useState<(Order & { id: string })[] | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [saveLocLoading, setSaveLocLoading] = useState(false);

  // Suscripción a perfil y órdenes
  useEffect(() => {
    if (!user) return;
    const unsubProf = subscribeUserProfile(user.uid, (p: UserProfile | null) => {
      setDisplayName(p?.displayName ?? "");
      setPhone(p?.phone ?? "");
      // Tomamos primero URL si existiera, si no, base64
      setAvatar(p?.avatarUrl ?? p?.avatarBase64 ?? null);
    });
    const unsubOrders = subscribeOrders(user.uid, setOrders);
    return () => {
      unsubProf?.();
      unsubOrders?.();
    };
  }, [user]);

  // ---------- Vista logueado ----------
  if (user) {
    const pickFromGallery = async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería para elegir una foto.");
          return;
        }
        const res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        if (res.canceled) return;
        const uri = res.assets?.[0]?.uri;
        if (!uri) return;
        setUploading(true);
        const dataUri = await uploadUserAvatarBase64(user.uid, uri);
        setAvatar(dataUri);
        Alert.alert("Foto de perfil", "¡Avatar actualizado!");
      } catch (e: any) {
        Alert.alert("Foto de perfil", e?.message ?? "Error al subir la imagen");
      } finally {
        setUploading(false);
      }
    };

    const saveProfile = async () => {
      try {
        setSavingProfile(true);
        await saveUserProfile(user.uid, { displayName, phone });
        Alert.alert("Perfil", "Datos guardados");
      } catch (e: any) {
        Alert.alert("Perfil", e?.message ?? "Error al guardar");
      } finally {
        setSavingProfile(false);
      }
    };

    return (
      <View style={styles.wrap}>
        <Text style={styles.h1}>Mi perfil</Text>
        <Text style={styles.p}>Email: {user.email}</Text>

        {/* --- Avatar + Datos --- */}
        <View style={styles.row}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={{ fontSize: 24 }}>🧑‍🍳</Text>
            </View>
          )}
          <View style={{ flex: 1, gap: 8 }}>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Nombre y apellido"
              style={styles.input}
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Teléfono"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable onPress={pickFromGallery} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9 }]}>
            {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Elegir foto</Text>}
          </Pressable>
          <Pressable onPress={saveProfile} style={({ pressed }) => [styles.btnOutline, pressed && { opacity: 0.9 }]}>
            {savingProfile ? <ActivityIndicator /> : <Text style={styles.btnOutlineTxt}>Guardar perfil</Text>}
          </Pressable>
        </View>

        {/* --- Ubicación --- */}
        <Text style={[styles.h2, { marginTop: 12 }]}>Mi ubicación</Text>
        <Text style={styles.p}>
          {loc.address
            ? `📍 ${loc.address}`
            : loc.coords
            ? `📍 Lat: ${loc.coords.lat.toFixed(5)} · Lng: ${loc.coords.lng.toFixed(5)}`
            : "Sin ubicación guardada"}
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={async () => {
              try {
                setLocLoading(true);
                const { coords, address } = await getCurrentLocation();
                dispatch(setLocation({ coords, address }));
              } catch (e: any) {
                Alert.alert("Ubicación", e?.message ?? "Error al obtener ubicación");
              } finally {
                setLocLoading(false);
              }
            }}
            style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9 }]}
          >
            {locLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Obtener ubicación</Text>}
          </Pressable>

          <Pressable
            onPress={async () => {
              if (!loc.coords) {
                Alert.alert("Ubicación", "Primero obtené tu ubicación");
                return;
              }
              try {
                setSaveLocLoading(true);
                await saveUserLocation(user.uid, loc.coords, loc.address);
                Alert.alert("Ubicación", "Guardada en tu perfil");
              } catch (e: any) {
                Alert.alert("Ubicación", e?.message ?? "Error al guardar");
              } finally {
                setSaveLocLoading(false);
              }
            }}
            style={({ pressed }) => [styles.btnOutline, pressed && { opacity: 0.9 }]}
          >
            {saveLocLoading ? <ActivityIndicator /> : <Text style={styles.btnOutlineTxt}>Guardar en Firebase</Text>}
          </Pressable>
        </View>

        {/* --- Órdenes --- */}
        <Text style={[styles.h2, { marginTop: 12 }]}>Mis órdenes</Text>
        {!orders ? (
          <ActivityIndicator />
        ) : orders.length === 0 ? (
          <Text style={styles.p}>Todavía no tenés órdenes.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(o) => o.id}
            contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
            renderItem={({ item }) => (
              <View style={styles.orderCard}>
                <Text style={styles.orderTitle}>
                  #{item.id.slice(-6).toUpperCase()} — ${item.total} — {item.items.length} ítems
                </Text>
                <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
            )}
          />
        )}

        <Pressable
          onPress={async () => {
            try {
              await fbSignOut(auth);
              dispatch(signOutLocal());
            } catch (e: any) {
              Alert.alert("Error al cerrar sesión", e?.message ?? String(e));
            }
          }}
          style={({ pressed }) => [styles.btnOutline, pressed && { opacity: 0.9 }]}
        >
          <Text style={styles.btnOutlineTxt}>Cerrar sesión</Text>
        </Pressable>
      </View>
    );
  }

  // ---------- Vista no logueado ----------
  const loading = status === "loading";
  const submit = async () => {
    if (!email || !pass) {
      Alert.alert("Campos vacíos", "Completá email y contraseña");
      return;
    }
    try {
      dispatch(setLoading());
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email.trim(), pass);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), pass);
      }
    } catch (e: any) {
      dispatch(setError(e?.message ?? "Error de autenticación"));
      Alert.alert("Autenticación", e?.message ?? "Error");
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</Text>
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={pass} onChangeText={setPass} />
      <Pressable disabled={loading} onPress={submit} style={({ pressed }) => [styles.btn, (pressed || loading) && { opacity: 0.9 }]}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>{mode === "login" ? "Entrar" : "Registrarme"}</Text>}
      </Pressable>
      {!!error && <Text style={styles.err}>{error}</Text>}
      <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")} style={({ pressed }) => [styles.link, pressed && { opacity: 0.7 }]}>
        <Text style={styles.linkTxt}>{mode === "login" ? "¿No tenés cuenta? Registrate" : "¿Ya tenés cuenta? Iniciá sesión"}</Text>
      </Pressable>
    </View>
  );
}

const AVATAR = 72;

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16, gap: 12 },
  h1: { fontFamily: "DMSerifDisplay_400Regular", fontSize: 24, color: COLORS.rojo },
  h2: { fontFamily: "DMSerifDisplay_400Regular", fontSize: 18, color: COLORS.rojo },
  p: { fontFamily: "Lora_400Regular", fontSize: 16 },
  input: {
    backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: "#00000010", fontFamily: "Lora_400Regular",
  },
  btn: { backgroundColor: COLORS.naranja, paddingVertical: 12, borderRadius: 12, alignItems: "center", paddingHorizontal: 12 },
  btnTxt: { color: "#fff", fontFamily: "Lora_700Bold", fontSize: 16 },
  link: { marginTop: 6, alignItems: "center" },
  linkTxt: { color: COLORS.rojo, fontFamily: "Lora_700Bold" },
  err: { color: "#b00020", fontFamily: "Lora_400Regular" },
  btnOutline: {
    borderWidth: 1, borderColor: COLORS.rojo, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 12, alignItems: "center", backgroundColor: "#fff",
  },
  btnOutlineTxt: { color: COLORS.rojo, fontFamily: "Lora_700Bold" },
  orderCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#00000010" },
  orderTitle: { fontFamily: "Lora_700Bold" },
  orderDate: { fontFamily: "Lora_400Regular", color: "#444", marginTop: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2, backgroundColor: "#eee" },
  avatarPlaceholder: { alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#00000010" },
});
