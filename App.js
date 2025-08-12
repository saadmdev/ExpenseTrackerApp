// App.js
import React from "react";
import {
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native"; // ✅ FIXED: added imports
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { TransactionProvider } from "./context/TransactionContext";
import { UserProvider } from "./context/UserContext";

import HomeScreen from "./screens/HomeScreen";
import CalendarScreen from "./screens/CalendarScreen";
import TransactionFormScreen from "./screens/TransactionFormScreen";
import SummaryScreen from "./screens/SummaryScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Tab = createBottomTabNavigator();

function AppTabs() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            paddingBottom: 6,
            marginBottom: 15,
            height: 62,
            paddingTop: 6,
          },
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.text,
          tabBarIcon: ({ color, size }) => {
            let name = "ellipse";
            if (route.name === "Home") name = "home";
            else if (route.name === "Calendar") name = "calendar";
            else if (route.name === "Add") name = "add-circle";
            else if (route.name === "Summary") name = "stats-chart";
            else if (route.name === "Settings") name = "settings";
            return <Ionicons name={name} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Add" component={TransactionFormScreen} />
        <Tab.Screen name="Summary" component={SummaryScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <TransactionProvider>
          <UserProvider>
            {/* ✅ SafeAreaView ensures top margin on Android */}
            <SafeAreaView style={styles.container}>
              <AppTabs />
            </SafeAreaView>
          </UserProvider>
        </TransactionProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
