import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const refreshAccessToken = async () => {
    const refreshToken =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");

    try {
      const response = await api.post("/refresh", { token: refreshToken });

      const { accessToken } = response.data;

      if (localStorage.getItem("keepLogin")) {
        localStorage.setItem("token", accessToken);
      } else {
        sessionStorage.setItem("token", accessToken);
      }

      setIsLoggedIn(true);
    } catch (error) {
      console.log("Failed to refresh access token: ", error);
      setIsLoggedIn(false);
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("refreshToken");
      window.location.replace("/login");
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// 로그인 상태를 사용하는 커스텀 Hook
export const useAuth = () => {
  return useContext(AuthContext);
};
