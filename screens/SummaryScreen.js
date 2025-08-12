// screens/SummaryScreen.js
import React, { useMemo } from "react";
import { View, Text, SafeAreaView, StyleSheet, Dimensions, ScrollView } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useTransactions } from "../context/TransactionContext";
import { useCurrency } from "../context/CurrencyContext";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function SummaryScreen() {
  const { theme } = useTheme();
  const { transactions } = useTransactions();
  const { currency } = useCurrency();

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount || 0), 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount || 0), 0);
    const left = income - expense;
    const byCategory = {};
    transactions.filter(t => t.type === "expense").forEach(e => {
      const c = e.category || "Other";
      byCategory[c] = (byCategory[c] || 0) + Number(e.amount || 0);
    });
    return { income, expense, left, byCategory };
  }, [transactions]);

  const pieData = Object.keys(totals.byCategory).map((k, i) => {
    const colorList = ["#FF6F61", "#6A4E9C", "#FFD700", "#4ECDC4", "#36A2EB"];
    const color = colorList[i % colorList.length];
    return {
      name: k,
      amount: totals.byCategory[k],
      color: (opacity = 1) => color,
      legendFontColor: theme.text,
      legendFontSize: 12,
    };
  });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.big, { color: theme.text }]}>Income</Text>
          <Text style={[styles.bigValue, { color: theme.success }]}>{currency} {totals.income.toFixed(2)}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.big, { color: theme.text }]}>Expenses</Text>
          <Text style={[styles.bigValue, { color: theme.danger }]}>{currency} {totals.expense.toFixed(2)}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.big, { color: theme.text }]}>Left</Text>
          <Text style={[styles.bigValue, { color: theme.text }]}>{currency} {totals.left.toFixed(2)}</Text>
        </View>

        <View style={{ height: 12 }} />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Expenses by Category</Text>

        {pieData.length > 0 ? (
          <PieChart
            data={pieData.map(p => ({
              name: p.name,
              amount: p.amount,
              color: p.color(1),
              legendFontColor: p.legendFontColor,
              legendFontSize: p.legendFontSize,
            }))}
            width={screenWidth - 32}
            height={220}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            chartConfig={{
              color: (opacity = 1) => theme.text,
              labelColor: () => theme.text,
            }}
          />
        ) : (
          <Text style={{ color: theme.placeholder, marginTop: 8 }}>No expense data to show</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  card: { padding: 14, borderRadius: 12, marginBottom: 12 },
  big: { fontSize: 16, fontWeight: "600" },
  bigValue: { fontSize: 20, fontWeight: "800", marginTop: 6 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 8, marginBottom: 6 },
});
