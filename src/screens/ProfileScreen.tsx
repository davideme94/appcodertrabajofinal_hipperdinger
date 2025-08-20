import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setError, setLoading, signOut as signOutLocal } from "../features/auth/authSlice";
import { COLORS } from "../theme/colors";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";
import { auth } from "../services/firebase";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((s) => s.auth);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // Ya logueado → vista de perfil
  if (user) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.h1}>Mi perfil</Text>
        <Text style={styles.p}>Email: {user.email}</Text>

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

  // No logueado → formulario login/registro
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
      // onAuthStateChanged seteará el usuario en Redux
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
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnTxt}>{mode === "login" ? "Entrar" : "Registrarme"}</Text>
        )}
      </Pressable>

      {!!error && <Text style={styles.err}>{error}</Text>}

      <Pressable
        onPress={() => setMode(mode === "login" ? "register" : "login")}
        style={({ pressed }) => [styles.link, pressed && { opacity: 0.7 }]}
      >
        <Text style={styles.linkTxt}>
          {mode === "login" ? "¿No tenés cuenta? Registrate" : "¿Ya tenés cuenta? Iniciá sesión"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16, gap: 12 },
  h1: { fontFamily: "DMSerifDisplay_400Regular", fontSize: 24, color: COLORS.rojo },
  p: { fontFamily: "Lora_400Regular", fontSize: 16 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#00000010",
    fontFamily: "Lora_400Regular",
  },
  btn: {
    backgroundColor: COLORS.naranja,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnTxt: { color: "#fff", fontFamily: "Lora_700Bold", fontSize: 16 },
  link: { marginTop: 6, alignItems: "center" },
  linkTxt: { color: COLORS.rojo, fontFamily: "Lora_700Bold" },
  err: { color: "#b00020", fontFamily: "Lora_400Regular" },
  btnOutline: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.rojo,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  btnOutlineTxt: { color: COLORS.rojo, fontFamily: "Lora_700Bold" },
});
