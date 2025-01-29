import { createContext } from "react";
import { PlayerData } from "../utils/types";

interface TeamContextType {
  roster: PlayerData[] | null;
  setRoster: React.Dispatch<React.SetStateAction<PlayerData[] | null>>;
}

export const TeamContext = createContext<TeamContextType | null>(null);
