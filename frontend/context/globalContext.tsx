// GlobalContext.tsx
"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the global state
interface GlobalContextType {
 showFullPhoto:boolean;
 setShowFullPhoto:React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with default values
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Create a provider component to wrap the app
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  // Global state
  
const[showFullPhoto,setShowFullPhoto]=useState(false);
  return (
    <GlobalContext.Provider value={{showFullPhoto,setShowFullPhoto}}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use global context
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
