import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import api from "../services/api";

const Signin = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);

  const LoginFunc = (e) => {
    e.preventDefault();

    if (!inputEmail) {
      return alert("Email을 입력하세요.");
    } else if (!inputPw) {
      return alert("Password를 입력하세요.");
    } else {
      axios
        .post("/user/login", {
          email: inputEmail,
          password: inputPw,
        })
        .then((res) => {
          const { accessToken, refreshToken } = res.data;

          if (keepLogin) {
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
          } else {
            sessionStorage.setItem("token", accessToken);
            sessionStorage.setItem("refreshToken", refreshToken);
          }

          if (res.status === 200) {
            console.log("로그인");
            window.location.replace("/");
          }
        })
        .catch((error) => {
          if (error.response) {
            const errorMessage = error.response.data.message;
            const status = error.response.status;

            if (errorMessage.includes("자격 증명에 실패")) {
              alert("이메일 혹은 비밀번호가 잘못되었습니다.");
            } else if (status === 500) {
              alert("이메일 혹은 비밀번호가 잘못되었습니다.");
            } else {
              alert("알 수 없는 오류가 발생했습니다.");
            }
          } else {
            console.log("Error Response : ", error.respons);
          }
        });
    }
  };
  return (
    <>
      <div className="w-screen h-screen content-center">
        <div className="grid gap-6">
          <div className="flex justify-center ">
            <Link to={"/"} className="text-3xl">
              {" "}
              Sign in to LOGO
            </Link>
          </div>
          <form
            className="flex justify-center content-between"
            onSubmit={LoginFunc}
          >
            <div className="grid gap-5">
              <input
                type="email"
                placeholder="이메일"
                className="bg-[#D9D9D9]/50 placeholder-black/50 text-2xl rounded-[10px] py-3 pl-[25px]"
                onChange={(e) => setInputEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="비밀번호"
                className="bg-[#D9D9D9]/50 placeholder-black/50 text-2xl rounded-[10px] py-3 pl-[25px]"
                onChange={(e) => setInputPw(e.target.value)}
              />
              <button
                className="border-[1px] bg-[#F5F5F5] border-black rounded-[10px] text-black text-2xl py-3"
                type="submit"
              >
                LOGO 로그인
              </button>
              <div className="flex justify-between content-center gap-20">
                <div className="flex justify-left content-center">
                  <input
                    type="checkbox"
                    id="keepLogin"
                    className="w-6 h-6 mt-[5px] mr-[18px] cursor-pointer"
                    checked={keepLogin}
                    onChange={() => setKeepLogin(!keepLogin)} //체크박스 상태 변경
                  />
                  <label
                    htmlFor="keepLogin"
                    className="text-2xl text-lightGray03 cursor-pointer"
                  >
                    로그인 유지
                  </label>
                </div>
                <div className="pb-[103px]">
                  <Link to={"/login/findpw"}>
                    <p className="text-2xl text-gray01">비밀번호 찾기</p>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <Link
                  to={"/join/agree"}
                  className="text-2xl  text-gray01 underline"
                >
                  회원가입
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signin;
