// screens/HomeScreen.js
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";
import { useTransactions } from "../context/TransactionContext";
import { useUser } from "../context/UserContext"; // ✅ import the new context
import * as Progress from "react-native-progress";

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { currency } = useCurrency();
  const { transactions } = useTransactions();
  const { userName, setUserName } = useUser();

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount || 0), 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount || 0), 0);
    const balance = income - expense;
    const usage = income > 0 ? Math.min(1, expense / income) : 0;
    const last = transactions.length
      ? transactions[transactions.length - 1]
      : null;
    return { income, expense, balance, usage, last };
  }, [transactions]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.greeting, { color: theme.text }]}>
          Hello, {userName || "there"} {/* ✅ uses dynamic name */}
        </Text>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>
            Total Balance
          </Text>
          <Text style={[styles.balance, { color: theme.text }]}>
            {currency} {totals.balance.toFixed(2)}
          </Text>

          <View style={styles.row}>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.text }]}>
                Income
              </Text>
              <Text style={[styles.statValue, { color: theme.success }]}>
                {currency} {totals.income.toFixed(2)}
              </Text>
            </View>

            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.text }]}>
                Expenses
              </Text>
              <Text style={[styles.statValue, { color: theme.danger }]}>
                {currency} {totals.expense.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <Progress.Bar
              progress={totals.usage}
              width={null}
              color={theme.progress}
              unfilledColor={theme.border}
              borderWidth={0}
              height={12}
            />
          </View>
        </View>

        <View style={{ height: 16 }} />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Last Transaction
        </Text>

        {totals.last ? (
          <TouchableOpacity
            style={[styles.transaction, { backgroundColor: theme.card }]}
          >
            <View>
              <Text style={[styles.txNote, { color: theme.text }]}>
                {totals.last.note ||
                  totals.last.category ||
                  "(no note)"}
              </Text>
              <Text
                style={{
                  color: theme.placeholder,
                  marginTop: 6,
                  fontSize: 12,
                }}
              >
                {totals.last.date || ""}
              </Text>
            </View>

            <Text
              style={{
                color:
                  totals.last.type === "income"
                    ? theme.success
                    : theme.danger,
                fontWeight: "700",
              }}
            >
              {totals.last.type === "income" ? "+" : "-"}
              {currency}
              {Number(totals.last.amount).toFixed(2)}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.transaction, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.placeholder }}>
              No transactions yet
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />

        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.accent }]}
          onPress={() => navigation.navigate("Add")}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Add Transaction
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, marginHorizontal: 17, marginTop: 15 },
  greeting: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#00000011",
    elevation: 2,
  },
  label: { fontSize: 14, opacity: 0.9 },
  balance: { fontSize: 28, fontWeight: "800", marginTop: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  stat: { flex: 1 },
  statLabel: { fontSize: 12 },
  statValue: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  transaction: {
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txNote: { fontSize: 16, fontWeight: "600" },
  addBtn: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
