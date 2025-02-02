import { createContext } from "react";

interface AuthContextType {
  userToken: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
