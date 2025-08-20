import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert, FlatList,
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
import { saveUserLocation } from "../services/users";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((s) => s.auth);
  const loc = useAppSelector((s) => s.location);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // ---------- Vista logueado ----------
  const [orders, setOrders] = useState<(Order & { id: string })[] | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setOrders(null);
    const unsub = subscribeOrders(user.uid, setOrders);
    return unsub;
  }, [user]);

  if (user) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.h1}>Mi perfil</Text>
        <Text style={styles.p}>Email: {user.email}</Text>

        {/* ---------- Ubicación ---------- */}
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
                setSaveLoading(true);
                await saveUserLocation(user.uid, loc.coords, loc.address);
                Alert.alert("Ubicación", "Guardada en tu perfil");
              } catch (e: any) {
                Alert.alert("Ubicación", e?.message ?? "Error al guardar");
              } finally {
                setSaveLoading(false);
              }
            }}
            style={({ pressed }) => [styles.btnOutline, pressed && { opacity: 0.9 }]}
          >
            {saveLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.btnOutlineTxt}>Guardar en Firebase</Text>
            )}
          </Pressable>
        </View>

        {/* ---------- Órdenes ---------- */}
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

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
      />

      <Pressable
        disabled={loading}
        onPress={submit}
        style={({ pressed }) => [styles.btn, (pressed || loading) && { opacity: 0.9 }]}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>{mode === "login" ? "Entrar" : "Registrarme"}</Text>}
      </Pressable>

      {!!error && <Text style={styles.err}>{error}</Text>}

      <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")} style={({ pressed }) => [styles.link, pressed && { opacity: 0.7 }]}>
        <Text style={styles.linkTxt}>{mode === "login" ? "¿No tenés cuenta? Registrate" : "¿Ya tenés cuenta? Iniciá sesión"}</Text>
      </Pressable>
    </View>
  );
}

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
});
