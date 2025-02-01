import { createContext } from "react";

export const ProfileContext = createContext<"players" | "teams" | null>(null);
