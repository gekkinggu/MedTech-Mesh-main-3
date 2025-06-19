"use client";

import React, { createContext, useContext } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useAuth();

  return (
    <AppContext.Provider value={{ user_clerk: user, isSignedIn, isLoaded, signOut }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);