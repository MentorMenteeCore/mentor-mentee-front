import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const FindPW = () => {
  const [email, setEmail] = useState("");

  const handlePwChange = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return alert("올바른 이메일 형식이 아닙니다.");
    }
    if (!email) {
      return alert("email을 입력해주세요.");
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/email/password`,
        { email: email }
      );
      console.log(response.status);
      alert("임시 비밀번호를 입력하신 이메일로 발송하였습니다.");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert(error.response.data.message);
        console.log(error);
      } else {
        console.error("비밀번호 찾기 요청 중 에러 발생:", error);
      }
    }
  };

  return (
    <>
      <div className="w-screen h-screen content-center">
        <div className="grid gap-6">
          <div className="flex justify-center">
            <Link to={"/"} className="text-3xl">
              {" "}
              LOGO
            </Link>
          </div>
          <form className="flex justify-center content-between">
            <div className="grid gap-4 w-1/3">
              <h2 className="text-black text-2xl underline pb-2">
                비밀번호 찾기
              </h2>
              <input
                type="email"
                placeholder="가입된 이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-lightGray01/50 placeholder-black/50 text-2xl rounded-[10px] py-3 px-6"
              />
              <button
                type="button"
                onClick={handlePwChange}
                className="border-[1px] bg-lightGray02 border-black rounded-[10px] text-black text-2xl py-3 px-6 "
              >
                임시 비밀번호 받기
              </button>
            </div>
          </form>
          <div className="flex justify-center pt-[200px]  "></div>
        </div>
      </div>
    </>
  );
};

export default FindPW;
