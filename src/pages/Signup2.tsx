import { Link } from "react-router-dom";
import { MaterialSymbolsVisibilityRounded } from "../assets/icons";
import { useState } from "react";
import { TextInput } from "react-native-paper";

const Signup2 = () => {
  function handleClick(event) {
    event.preventDefault();
    window.location.href = "/";
  }
  const [iconColor, setIconColor] = useState("#000");
  const [passwordType, setPasswordType] = useState({
    type: "password",
    visible: false,
  });

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
                        className="bg-lightGray01 placeholder-black text-2xl rounded-[10px] opacity-50 pl-[21px] py-4 pr-7"
                      />
                      <button
                        type="submit"
                        className="bg-red01 opacity-50 text-white text-2xl rounded-[20px] py-2 px-5"
                      >
                        중복확인
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-xl">비밀번호</p>
                    <div className="grid gap-3">
                      <input
                        type="password"
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
                    type="submit"
                    onClick={handleClick}
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
