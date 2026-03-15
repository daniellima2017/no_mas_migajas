"use client";

import { createContext, useContext } from "react";

export const ScarcityContext = createContext({
  connected: 37,
  remaining: 84,
});

export function useScarcity() {
  return useContext(ScarcityContext);
}
