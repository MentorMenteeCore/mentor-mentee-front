import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_KEY}`,
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  async (config) => {
    let token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    // 토큰이 있는 경우 Authorization 헤더에 설정
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

      const refreshToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          console.log("refresh token", refreshToken);
          const response = await api.post(
            `/refresh`,
            {
              refreshToken,
            },
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;
          console.log("토큰 재발급");

          // 토큰을 "로그인 상태 유지" 여부에 따라 저장
          if (localStorage.getItem("keepLogin")) {
            localStorage.setItem("token", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);
          } else {
            sessionStorage.setItem("token", newAccessToken);
            sessionStorage.setItem("refreshToken", newRefreshToken);
          }
        } catch (error) {
          // console.log("토큰 재발급 실패: ", error);
          // localStorage.removeItem("token");
          // sessionStorage.removeItem("token");
          // window.location.replace("/login");
          // return Promise.reject(error);
        }
      }
    }
    console.log("Error response", error.response);
    return Promise.reject(error);
  }
);

export default api;
