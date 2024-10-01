import axios from "axios";
import { useAuth } from "../components/AuthProvider";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_KEY}`,
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Access Token이 만료되었습니다.");

      const { setIsLoggedIn } = useAuth();
      setIsLoggedIn(false);
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default api;

// import axios from 'axios';
// import { getCookie } from './utils'; // 쿠키를 가져오는 유틸리티 함수

// const api = axios.create({
//   baseURL: `${import.meta.env.VITE_API_KEY}`, // 기본 API URL
// });

// // Axios 인터셉터 설정
// api.interceptors.request.use(
//   (config) => {
//     const token = getCookie('accessToken'); // 쿠키에서 토큰을 가져오는 함수
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api; // Axios 인스턴스 내보내기
