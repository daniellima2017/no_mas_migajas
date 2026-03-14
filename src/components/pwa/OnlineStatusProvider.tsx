"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { OfflineIndicator } from "./OfflineIndicator";

interface OnlineStatusContextValue {
  isOnline: boolean;
}

const OnlineStatusContext = createContext<OnlineStatusContextValue>({
  isOnline: true,
});

interface OnlineStatusProviderProps {
  children: ReactNode;
}

export function OnlineStatusProvider({ children }: OnlineStatusProviderProps) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={{ isOnline }}>
      {children}
      <OfflineIndicator show={!isOnline} />
    </OnlineStatusContext.Provider>
  );
}

export function useOnlineContext() {
  const context = useContext(OnlineStatusContext);
  if (context === undefined) {
    throw new Error("useOnlineContext must be used within OnlineStatusProvider");
  }
  return context;
}