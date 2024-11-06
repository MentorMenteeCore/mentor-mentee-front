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
  logout: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logout = async () => {
    const accessToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const response = await api.delete("/user/logout", {
        headers: {
          Authorization: `Bearer ${{ accessToken }}`,
        },
        data: {
          token: accessToken,
        },
      });

      // 로그아웃 성공 확인
      if (response.status === 200) {
        setIsLoggedIn(false);
        // 로그아웃 후 토큰 제거
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("refreshToken");
        console.log("로그아웃 성공");
      } else {
        console.log("로그아웃 실패: ", response.data);
      }
    } catch (error) {
      console.log(
        "로그아웃 중 오류 발생: ",
        error.response ? error.response.data : error
      );
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 로그인 상태를 사용하는 커스텀 Hook
export const useAuth = () => {
  return useContext(AuthContext);
};
