// context/CurrencyContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("@currency");
        if (saved) setCurrency(saved);
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("@currency", currency).catch(() => {});
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
