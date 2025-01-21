import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

export default function ChangePW() {
  const [currentPW, setCurrentPW] = useState("");
  const [changePW, setChangePW] = useState("");
  const [confirmPW, setConfirmPW] = useState("");
  const navigate = useNavigate();

  const handleChangePW = async () => {
    if (!currentPW && !changePW && !confirmPW) {
      alert("비밀번호를 입력해주세요.");
    }
    try {
      const response = await api.patch(`/user/password`, {
        oldPassword: currentPW,
        newPassword: changePW,
        confirmPassword: confirmPW,
      });

      if (response.status === 200) {
        alert("비밀번호 변경이 완료되었습니다.");
        navigate("/login");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.message ===
          "입력한 비밀번호가 기존 비밀번호와 같지 않습니다."
      ) {
        alert(error.respone.data.message);
      } else if (
        error.response &&
        error.response.data.message === "새 비밀번호가 일치하지 않습니다."
      ) {
        alert(error.response.data.message);
      } else if (
        error.response &&
        error.response.data.message ===
          "기존 비밀번호랑 다른 비밀번호를 입력해 주세요."
      ) {
        alert(error.response.data.message);
      } else if (
        error.response &&
        error.response.data.message ===
          "비밀번호는 5자리 이상 15자리 이하로 적어주세요"
      ) {
        alert(error.response.data.message);
      } else if (
        error.response &&
        error.response.data.message === "변경 할 비밀번호를 입력해 주세요"
      ) {
        alert(error.response.data.message);
      } else if (
        error.response &&
        error.response.data.message === "한번 더 비밀번호를 입력해 주세요"
      ) {
        alert(error.response.data.message);
      }
    }
  };
  return (
    <>
      <div>
        <p className="text-2xl pb-2">비밀번호 변경</p>
        <div className="grid border-2 border-black py-11 px-11 gap-11">
          <div className="">
            <p className="text-xl text-lightGray04 pb-3">현재 비밀번호</p>
            <div className="w-full border-2 border-black rounded-[10px] p-2">
              <input
                className="px-2 w-full text-lg outline-none"
                type="password"
                onChange={(e) => {
                  setCurrentPW(e.target.value);
                }}
                placeholder="기존 비밀번호를 입력해주세요."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xl text-lightGray04 pb-3">변경할 비밀번호</p>
              <div className="w-full border-2 border-black rounded-[10px] p-2">
                <input
                  className="px-2 w-full text-lg outline-none"
                  type="password"
                  onChange={(e) => {
                    setChangePW(e.target.value);
                  }}
                  placeholder="변경할 비밀번호를 입력해주세요."
                />
              </div>
            </div>
            <div>
              <p className="text-xl text-lightGray04 pb-3">한번 더 입력</p>
              <div className="w-full border-2 border-black rounded-[10px] p-2">
                <input
                  className="px-2 w-full text-lg outline-none"
                  type="password"
                  onChange={(e) => {
                    setConfirmPW(e.target.value);
                  }}
                  placeholder="변경할 비밀번호를 한번 더 입력해주세요."
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-red01 opacity-50 text-white text-2xl rounded-[10px] py-2 px-5 w-max justify-self-end"
            onClick={handleChangePW}
          >
            변경하기
          </button>
        </div>
      </div>
    </>
  );
}
