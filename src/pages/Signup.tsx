import axios from "axios";
import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-dom";

const Signup = () => {
  const location = useLocation();
  const { role } = location.state || {};
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();

  const handleEmailCheck = async () => {
    if (!email) {
      return alert("Email을 입력하세요.");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return alert("올바른 이메일 형식이 아닙니다.");
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_KEY}/user/signup/email`,
        {
          params: { email: email },
        }
      );

      if (response.status === 200) {
        setEmailExists(false);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "중복 이메일 입니다."
      ) {
        setEmailExists(true);
      } else {
        console.error("이메일 확인 중 오류 발생: ", error);
      }
    }
  };

  const handleEmailSend = async () => {
    if (!email) {
      return alert("이메일을 입력해주세요.");
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/email/send`,
        { email: email }
      );
      if (response.status === 200) {
        setCodeSent(true);
        alert("인증번호가 전송되었습니다.");
      }
    } catch (error) {
      console.error("인증번호 전송 중 요류 발생: ", error);
      alert("인증번호 전송에 실패했습니다.");
    }
  };

  const hanldeVerificationCodeCheck = async () => {
    if (!name) {
      return alert("이름을 입력해주세요.");
    } else if (!email) {
      return alert("이메일을 입력해주세요.");
    } else if (!verificationCode) {
      return alert("인증번호를 입력해주세요.");
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/email/verify`,
        { email, code: verificationCode }
      );

      if (response.status === 200) {
        navigate("/join/info2", { state: { name, email, role } });
      }
    } catch (error) {
      alert("인증번호가 틀렸습니다.");
      console.log("인증번호 확인 중 오류 발생: ", error);
    }
  };

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-lightGray01 placeholder-black text-2xl rounded-[10px] opacity-50 pl-[21px] py-4"
            />
            <div className="flex justify-between gap-3">
              <input
                type="email"
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
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="bg-lightGray01 placeholder-black text-2xl rounded-[10px] opacity-50 py-4 pl-[21px]"
                />
                <button
                  type="button"
                  className="bg-red01 opacity-50 text-white text-2xl rounded-[20px] py-3 px-3 flex-1"
                  onClick={handleEmailSend}
                >
                  인증번호 발송
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={hanldeVerificationCodeCheck}
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
