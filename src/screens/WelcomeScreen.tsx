import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../theme/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Welcome: undefined;
  MainTabs: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <Text style={styles.brandIcon}>🏪</Text>
        <Text style={styles.title}>Las Hermanas</Text>
        <Text style={styles.subtitle}>Almacén & Panadería</Text>

        <Pressable
          onPress={() => {
            Alert.alert("¡Bienvenida/o!", "Entrando a la tienda…");
            navigation.replace("MainTabs"); // 👈 Solo navega al tocar “Entrar”
          }}
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.btnText}>Entrar</Text>
        </Pressable>
      </View>

      <View style={styles.palette}>
        <View style={[styles.dot, { backgroundColor: COLORS.crema }]} />
        <View style={[styles.dot, { backgroundColor: COLORS.verdeSuave }]} />
        <View style={[styles.dot, { backgroundColor: COLORS.naranja }]} />
        <View style={[styles.dot, { backgroundColor: COLORS.beige }]} />
        <View style={[styles.dot, { backgroundColor: COLORS.rojo }]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.crema, alignItems: "center", justifyContent: "center" },
  card: {
    width: "88%", padding: 24, borderRadius: 24, backgroundColor: "#fff", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 12, elevation: 6,
  },
  brandIcon: { fontSize: 48, marginBottom: 8 },
  title: {
    fontSize: 36,
    color: COLORS.rojo,
    textAlign: "center",
    fontFamily: "DMSerifDisplay_400Regular",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: "#3b3b3b",
    textAlign: "center",
    fontFamily: "Lora_400Regular",
  },
  btn: {
    marginTop: 20, backgroundColor: COLORS.naranja, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 16,
  },
  btnText: { color: "#fff", fontSize: 16, fontFamily: "Lora_700Bold" },
  palette: { flexDirection: "row", gap: 8, marginTop: 16 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: "#00000010" },
});
