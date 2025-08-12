// context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("@user_name");
        if (saved) setUserName(saved);
      } catch (e) {
        console.log("Error loading username", e);
      }
    })();
  }, []);

  const updateUserName = async (name) => {
    setUserName(name);
    try {
      await AsyncStorage.setItem("@user_name", name);
    } catch (e) {
      console.log("Error saving username", e);
    }
  };

  return (
    <UserContext.Provider value={{ userName, setUserName: updateUserName }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ This is the hook you should import
export const useUser = () => useContext(UserContext);
