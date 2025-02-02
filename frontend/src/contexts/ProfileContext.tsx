import { createContext } from "react";
import { PlayerData, TeamData } from "../utils/types";

export interface ProfileContextProps {
  type: "players" | "teams";
  data: TeamData | PlayerData | undefined;
}
export const ProfileContext = createContext<ProfileContextProps | null>(null);
