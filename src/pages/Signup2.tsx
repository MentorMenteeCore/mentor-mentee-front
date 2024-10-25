import { Link, useLocation, useNavigate } from "react-router-dom";
import { MaterialSymbolsVisibilityRounded } from "../assets/icons";
import { useState } from "react";
import axios from "axios";

const Signup2 = () => {
  const location = useLocation();
  const { name, email, role } = location.state || {};
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [nicknameExists, setNicknameExists] = useState<boolean | null>(null);
  const [iconColor, setIconColor] = useState("#000");
  const [passwordType, setPasswordType] = useState({
    type: "password",
    visible: false,
  });
  const navigate = useNavigate();

  function handlePasswordType() {
    setPasswordType(() => {
      if (!passwordType.visible) {
        setIconColor("#ff0000");
        return { type: "text", visible: true };
      } else {
        setIconColor("#000");
        return { type: "password", visible: false };
      }
    });
  }

  const handleNicknameCheck = async () => {
    if (!nickname) {
      return alert("Nickname을 입력하세요.");
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_KEY}/user/signup/nickname`,
        { params: { nickname: nickname } }
      );
      if (response.status == 200) {
        setNicknameExists(false);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "유저의 닉네임이 이미 존재합니다"
      ) {
        setNicknameExists(true);
        console.error("중복 닉네임입니다.");
      } else {
        setNicknameExists(null);
        console.error("닉네임 확인 중 오류 발생: ", error);
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!password) {
      return alert("비밀번호를 입력해주세요.");
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/user/sign-up`,
        { email, userName: name, nickname, password, role }
      );

      if (response.status === 200) {
        alert("회원가입이 완료되었습니다.");
        navigate("/");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생: ", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <>
      <div className="">
        <div className="grid place-content-center gap-4">
          <div className="flex justify-center pt-4">
            <Link to={"/"} className="text-3xl">
              LOGO
            </Link>
          </div>
          <div className="flex justify-center content-between">
            <div className="bg-lightGray02 border-[1px] border-[#333333]/30 pt-14 px-8 pb-6 ">
              <form className="">
                <div className="grid gap-5">
                  <div className="grid gap-2">
                    <p className="text-xl">닉네임</p>
                    <div className="flex justify-between gap-3">
                      <input
                        type="text"
                        placeholder="닉네임을 입력해주세요."
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="bg-lightGray01 placeholder-black text-2xl rounded-[10px] opacity-50 pl-[21px] py-4 pr-7"
                      />
                      <button
                        type="button"
                        className="bg-red01 opacity-50 text-white text-2xl rounded-[20px] py-2 px-5"
                        onClick={handleNicknameCheck}
                      >
                        중복확인
                      </button>
                    </div>
                    {nicknameExists !== null && (
                      <p
                        className={`text-xl ${
                          nicknameExists ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {nicknameExists
                          ? "이미 등록된 닉네임입니다."
                          : "사용 가능한 닉네임입니다."}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <p className="text-xl">비밀번호</p>
                    <div className="grid gap-3">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        placeholder="비밀번호를 입력해 주세요. (8자리 이상)"
                        className="bg-lightGray01 placeholder-black text-2xl rounded-[10px] opacity-50 pl-[21px] py-4"
                      />
                      <label className="relative block">
                        <input
                          type={passwordType.type}
                          placeholder="비밀번호를 한번 더 입력해 주세요."
                          className="bg-lightGray01 placeholder-black opacity-50 text-2xl rounded-[10px] w-full pl-[21px] py-4"
                        />
                        <button
                          type="button"
                          onClick={handlePasswordType}
                          className="absolute inset-y-5 right-2 flex content-center pr-2"
                        >
                          <MaterialSymbolsVisibilityRounded
                            className="w-6 h-7"
                            style={{ color: iconColor }}
                          />
                        </button>
                      </label>
                    </div>
                  </div>
                  <div className="py-[60px]"></div>
                  <button
                    className="border-[1px] bg-transparent border-black rounded-[10px] text-black text-2xl py-4 p-13 "
                    type="button"
                    onClick={handleSignup}
                  >
                    회원가입 완료
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup2;
