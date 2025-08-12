// screens/TransactionFormScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../context/ThemeContext";
import { useTransactions } from "../context/TransactionContext";

export default function TransactionFormScreen({ navigation }) {
  const { theme } = useTheme();
  const { addTransaction } = useTransactions();

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [note, setNote] = useState("");

  const getPakistanDateString = () => {
    const now = new Date();
    // Format date in Asia/Karachi timezone in YYYY-MM-DD format
    const options = { timeZone: "Asia/Karachi", year: "numeric", month: "2-digit", day: "2-digit" };
    const parts = new Intl.DateTimeFormat("en-CA", options).formatToParts(now);
    const year = parts.find(p => p.type === "year").value;
    const month = parts.find(p => p.type === "month").value;
    const day = parts.find(p => p.type === "day").value;
    return `${year}-${month}-${day}`;
  };

  const save = () => {
    if (!amount) return;
    const tx = {
      type,
      amount: Number(amount),
      category,
      note,
      date: getPakistanDateString(), // ✅ Correct timezone date
    };
    addTransaction(tx);
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, { padding: 16 }]}>
            <Text style={[styles.title, { color: theme.text }]}>Add Transaction</Text>

            <Text style={[styles.inputLabel, { color: theme.text }]}>Type</Text>
            <View style={[styles.pickerWrap, { backgroundColor: theme.card }]}>
              <Picker
                selectedValue={type}
                onValueChange={(v) => setType(v)}
                dropdownIconColor={theme.text}
                style={{ color: theme.text, backgroundColor: theme.card }}
                itemStyle={{ color: theme.text }}
              >
                <Picker.Item label="Expense" value="expense" />
                <Picker.Item label="Income" value="income" />
              </Picker>
            </View>

            <Text style={[styles.inputLabel, { color: theme.text }]}>Amount</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={theme.placeholder}
              style={[
                styles.input,
                { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
              ]}
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Category</Text>
            <View style={[styles.pickerWrap, { backgroundColor: theme.card }]}>
              <Picker
                selectedValue={category}
                onValueChange={(v) => setCategory(v)}
                dropdownIconColor={theme.text}
                style={{ color: theme.text, backgroundColor: theme.card }}
                itemStyle={{ color: theme.text }}
              >
                <Picker.Item label="Groceries" value="Groceries" />
                <Picker.Item label="Fuel" value="Fuel" />
                <Picker.Item label="Salary" value="Salary" />
                <Picker.Item label="Shopping" value="Shopping" />
                <Picker.Item label="Entertainment" value="Entertainment" />
                <Picker.Item label="Bills" value="Bills" />
                <Picker.Item label="Children" value="Children" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            <Text style={[styles.inputLabel, { color: theme.text }]}>Note</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="optional note"
              placeholderTextColor={theme.placeholder}
              style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            />

            <View style={{ height: 12 }} />

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.accent }]}
              onPress={save}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Save Transaction</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  inputLabel: { fontSize: 14, marginTop: 8, marginBottom: 6 },
  input: { padding: 12, borderRadius: 8, borderWidth: 1 },
  pickerWrap: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#00000010",
    marginBottom: 8,
  },
  saveBtn: { padding: 14, borderRadius: 10, alignItems: "center", marginTop: 6 },
});
