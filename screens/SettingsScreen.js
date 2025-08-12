import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";
import { useTransactions } from "../context/TransactionContext"; // assuming you have this
import { useUser } from "../context/UserContext";

export default function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { clearTransactions } = useTransactions();
  const { userName, setUserName } = useUser();

  const [tempName, setTempName] = useState(userName || "");

  const confirmReset = () => {
    Alert.alert(
      "Reset All Data",
      "Are you sure you want to delete all transactions?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, reset", style: "destructive", onPress: clearTransactions },
      ]
    );
  };

  const confirmNameChange = () => {
    if (tempName.trim() === "") {
      Alert.alert("Invalid Name", "Please enter a valid name.");
      return;
    }
    Alert.alert(
      "Change Name",
      `Set your name to "${tempName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => setUserName(tempName.trim()) },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={{ padding: 16 }}>
        <Text style={[styles.header, { color: theme.text }]}>Settings</Text>

        {/* Dark mode toggle */}
        <View style={[styles.block, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>Dark mode</Text>
          <Switch
            value={mode === "dark"}
            onValueChange={(v) => setMode(v ? "dark" : "light")}
            thumbColor="#fff"
            trackColor={{ false: "#ccc", true: theme.accent }}
          />
        </View>

        {/* Currency Picker */}
        <View style={[styles.block, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>Currency</Text>
          <Picker
            selectedValue={currency}
            onValueChange={(v) => setCurrency(v)}
            dropdownIconColor={theme.text}
            style={{ color: theme.text, backgroundColor: theme.card }}
            itemStyle={{ color: theme.text }}
          >
            <Picker.Item label="USD ($)" value="USD" />
            <Picker.Item label="PKR (₨)" value="PKR" />
            <Picker.Item label="EUR (€)" value="EUR" />
            <Picker.Item label="GBP (£)" value="GBP" />
          </Picker>
        </View>

        {/* Name Change */}
        <View style={[styles.block, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>Your Name</Text>
          <TextInput
            value={tempName}
            onChangeText={setTempName}
            placeholder="Enter your name"
            placeholderTextColor={theme.placeholder}
            style={{
              color: theme.text,
              borderBottomWidth: 1,
              borderBottomColor: theme.border,
              marginTop: 8,
              paddingVertical: 4,
            }}
          />
          <TouchableOpacity
            onPress={confirmNameChange}
            style={{
              backgroundColor: theme.accent,
              padding: 10,
              borderRadius: 6,
              marginTop: 10,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Save Name</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={[styles.block, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>About</Text>
          <Text style={{ color: theme.placeholder, marginTop: 6 }}>
            Expense Tracker — created by Muhammad Saad {"\n"}Version 1.0 ©
          </Text>
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          onPress={confirmReset}
          style={{
            backgroundColor: theme.danger,
            padding: 12,
            borderRadius: 8,
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
            Reset All Data
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  block: { padding: 12, borderRadius: 10, marginBottom: 12 },
  label: { fontSize: 16, fontWeight: "600" },
});
