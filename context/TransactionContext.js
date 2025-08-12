// context/TransactionContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TransactionContext = createContext();

const makeId = () => `${Date.now()}_${Math.floor(Math.random() * 100000)}`;

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // load on start and ensure each tx has an id (backwards-compat)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("@transactions");
        if (raw) {
          let parsed = JSON.parse(raw);
          let changed = false;
          parsed = parsed.map((t) => {
            if (!t.id) {
              changed = true;
              return { id: makeId(), ...t };
            }
            return t;
          });
          setTransactions(parsed);
          if (changed) {
            // persist with ids
            AsyncStorage.setItem("@transactions", JSON.stringify(parsed)).catch(() => {});
          }
        }
      } catch (e) {
        console.warn("Failed to load transactions", e);
      }
    })();
  }, []);

  // persist on change
  useEffect(() => {
    AsyncStorage.setItem("@transactions", JSON.stringify(transactions)).catch(() => {});
  }, [transactions]);

  const addTransaction = (tx) => {
    const withId = tx.id ? tx : { id: makeId(), ...tx };
    setTransactions((prev) => [...prev, withId]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const clearTransactions = async () => {
    setTransactions([]);
    await AsyncStorage.removeItem("@transactions").catch(() => {});
  };

  return (
    <TransactionContext.Provider
      value={{ transactions, addTransaction, deleteTransaction, clearTransactions }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
