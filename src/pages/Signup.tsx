import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState(null);

  const handleEmailCheck = async () => {
    if (!email) {
      return alert("Email을 입력하세요.");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return alert("올바른 이메일 형식이 아닙니다.");
    }

    // 입력된 이메일이 "test@example.com"인 경우에만 중복 확인
    if (email === "test@example.com") {
      setEmailExists(true);
    } else {
      setEmailExists(false);
    }

    // 주석 처리된 axios 요청도 사용하고 싶다면 아래의 코드 활성화
    // try {
    //   const response = await axios.post("/user/signup/email", {
    //     email: email,
    //   });

    //   if (response.status === 200) {
    //     setEmailExists(response.data.exists); // 이메일 존재 여부에 따라 상태 업데이트
    //   }
    // } catch (error) {
    //   console.error("이메일 확인 중 오류 발생: ", error);
    // }
  };

  function handleClick(event) {
    event.preventDefault();
    window.location.href = "/join/info2";
  }

  return (
    <div className="grid place-content-center gap-4">
      <div className="flex justify-center pt-4">
        <Link to={"/"} className="text-3xl">
          LOGO
        </Link>
      </div>
      <div className="flex justify-center">
        <div className="bg-lightGray02 border-[1px] border-[#333333]/30 pt-14 px-8 pb-6 w-[540px] h-[600px] relative">
          <form className="grid gap-5 mb-20">
            <input
              type="text"
              placeholder="성명"
              className="bg-lightGray01 placeholder-black text-2xl rounded-[10px] opacity-50 pl-[21px] py-4"
            />
            <div className="flex justify-between gap-3">
              <input
                type="email" // 이메일 타입으로 변경
                placeholder="이메일"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="bg-lightGray01 placeholder-black text-2xl rounded-[10px] opacity-50 py-4 pl-[21px]"
              />
              <button
                type="button"
                className="bg-red01 opacity-50 text-white text-2xl rounded-[20px] py-3 px-3 flex-1"
                onClick={handleEmailCheck}
              >
                중복 확인
              </button>
            </div>
            {emailExists !== null && (
              <p
                className={`text-xl ${
                  emailExists ? "text-red-500" : "text-green-500"
                }`}
              >
                {emailExists
                  ? "이미 등록된 이메일입니다."
                  : "사용 가능한 이메일입니다. "}
              </p>
            )}
            {emailExists === false && (
              <div className="flex justify-between gap-3 mb-5">
                <input
                  type="text"
                  placeholder="인증번호(6자리)"
                  className="bg-lightGray01 placeholder-black text-2xl rounded-[10px] opacity-50 py-4 pl-[21px]"
                />
                <button
                  type="button"
                  className="bg-red01 opacity-50 text-white text-2xl rounded-[20px] py-3 px-3 flex-1"
                >
                  인증번호 발송
                </button>
              </div>
            )}
            <button
              onClick={handleClick}
              className="border-[1px] bg-transparent border-black rounded-[10px] text-black text-2xl py-3"
            >
              확인
            </button>
          </form>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
            <Link to={"/login"}>
              <p className="text-xl hover:underline">이미 LOGO 회원이신가요?</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
