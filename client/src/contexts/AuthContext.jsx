import { createContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await authAPI.checkLogin();

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();

   
        setUser({
          username: data.username,
          phone: data.phone
        });
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []);

 
  const login = async (phone, password) => {
    try {
      const response = await authAPI.login(phone, password);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Login failed" }));
        return { success: false, message: errorData.message };
      }

      const data = await response.json();

      
      setUser({
        username: data.user.username,
        phone: data.user.phone
      });

      return { success: true };
    } catch {
      return { success: false, message: "Network error occurred" };
    }
  };


  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
