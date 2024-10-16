import axios from "axios";
import { useContext, createContext, useState } from "react";

interface UserContextType {
  user: string | null;
  SetUser: () => Promise<void>;
  removeUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  const SetUser = async () => {
    const response = await axios.get("/api/auth/getuser");
    setUser(response.data._id);
  };

  const removeUser = async () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, SetUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
