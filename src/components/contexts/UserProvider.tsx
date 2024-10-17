import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";

interface UserContextType {
  user: string | null;
  getUser: () => Promise<void>;
  removeUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  getUser: async () => {},
  removeUser: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  const getUser = async () => {
    const response = await axios.get("/api/auth/getuser");
    setUser(response.data._id);
  };

  const removeUser = async () => {
    setUser(null);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, getUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
