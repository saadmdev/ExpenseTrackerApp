// screens/CalendarScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useTransactions } from "../context/TransactionContext";
import { useCurrency } from "../context/CurrencyContext";

export default function CalendarScreen() {
  const { theme } = useTheme();
  const { transactions, deleteTransaction } = useTransactions();
  const { currency } = useCurrency();
  const [selected, setSelected] = useState(null);

  const byDate = useMemo(() => {
  const map = {};
  transactions.forEach((t) => {
    const d = t.date
      ? t.date.slice(0, 10)
      : new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" }); // PKT
    if (!map[d]) map[d] = [];
    map[d].push(t);
  });
  return map;
  }, [transactions]);

  const marked = useMemo(() => {
    const m = {};
    Object.keys(byDate).forEach((d) => {
      m[d] = { marked: true, dotColor: "#FF6F61" };
    });
    if (selected) {
      m[selected] = { ...(m[selected] || {}), selected: true, selectedColor: theme.calendarSelected };
    }
    return m;
  }, [byDate, selected, theme]);

  const listForSelected = selected ? byDate[selected] || [] : [];

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Calendar
          onDayPress={(day) => setSelected(day.dateString)}
          markedDates={marked}
          theme={{
            backgroundColor: theme.card,
            calendarBackground: theme.card,
            dayTextColor: theme.text,
            monthTextColor: theme.text,
            arrowColor: theme.text,
            todayTextColor: theme.accent,
            selectedDayBackgroundColor: theme.calendarSelected,
            selectedDayTextColor: "#fff",
          }}
          style={{ borderRadius: 12, overflow: "hidden" }}
        />

        <View style={{ height: 16 }} />

        <Text style={{ color: theme.text, fontWeight: "700", marginBottom: 8 }}>
          {selected ? `Transactions on ${selected}` : "Select a date"}
        </Text>

        {listForSelected.length === 0 ? (
          <Text style={{ color: theme.placeholder }}>No transactions for this date</Text>
        ) : (
          listForSelected.map((t) => (
            <View
              key={t.id}
              style={{
                backgroundColor: theme.card,
                padding: 12,
                borderRadius: 10,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: theme.border,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: theme.text, fontWeight: "600" }}>{t.category || "(no category)"}</Text>
                <Text style={{ color: theme.placeholder, marginTop: 6 }}>{t.note || ""}</Text>
                <Text style={{ color: t.type === "income" ? theme.success : theme.danger, marginTop: 8, fontWeight: "700" }}>
                  {t.type === "income" ? "+" : "-"}{currency} {Number(t.amount).toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => confirmDelete(t.id)}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: "transparent",
                }}
                accessibilityLabel="Delete transaction"
              >
                <Ionicons name="trash-outline" size={22} color={theme.text} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
