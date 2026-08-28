import { createContext, useContext, useState } from "react";
import { login as loginRequest } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const login = async (email, password) => {
    const data = await loginRequest(email, password);

    localStorage.setItem("token", data.token);

    const userData = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
    return useContext(AuthContext);
}
