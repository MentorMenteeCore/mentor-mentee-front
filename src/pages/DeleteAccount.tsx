import { useRef } from "react";
import { useState } from "react";

export default function DeleteAccount() {
  const checkboxRef = useRef(null);
  const [email, setEmail] = useState("");

  const handleDeleteAccount = async () => {
    if (!checkboxRef.current.checked) {
      alert("주의사항을 모두 확인하셔야 회원 탈퇴 가능합니다.");
      return;
    }
    if (!email) {
      alert("Email을 입력해주세요.");
    }
    try {
      const response = await api.delete(`/user`, {
        params: { useremail: email },
      });
      if (response.status === 200) {
        alert("회원탈퇴가 완료되었습니다.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "유저의 이메일이 적합하지 않습니다."
      ) {
        alert(error.response.data.message);
      }
    }
  };
  return (
    <>
      <div>
        <p className="text-2xl pb-2">회원탈퇴</p>
        <div className="grid border-2 border-black py-11 px-11 gap-10">
          <div className="">
            <p className="text-xl text-lightGray04 pb-3">이메일 확인</p>
            <div className="w-full border-2 border-black rounded-[10px] p-2">
              <input
                className="px-2 w-full text-lg outline-none"
                type="email"
                placeholder="LOGO에 가입하신 이메일을 적어주세요."
              />
            </div>
          </div>
          <div>
            <div className="w-full border-2 border-black rounded-[5px] p-4 bg-lightGray01 text-xl">
              <li>
                현재 사용중인 계정 정보는 회원 탈퇴 후 복구가 불가능합니다.
              </li>
              <li>
                진행 중인 거래건이 있거나 페널티 조치 중인 경우 탈퇴 신청이
                불가합니다.
              </li>
              <li>
                탈퇴 후 회원님의 정보는 전자상거래 소비자보호법에 의거한 LOGO
                개인정보처리방침에 따라 관리됩니다.
              </li>
              <li>
                구매후기 및 답글은 탈퇴 시 자동 삭제되지 않습니다. 탈퇴 후에는
                계정 정보가 삭제되어 본인 확인이 불가하므로, 탈퇴 신청 전에
                게시글 삭제를 요청해 주시기 바랍니다.
              </li>
            </div>
            <div className="flex items-center pt-4">
              <input
                id="star"
                type="checkbox"
                ref={checkboxRef}
                className="w-5 h-5"
              />
              <label htmlFor="star" className="pl-4 text-xl font-bold">
                주의사항을 모두 확인했습니다.
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="text-red01 border-2 border-black text-2xl rounded-[20px] py-4 px-9 w-max justify-self-end"
            onClick={handleDeleteAccount}
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </>
  );
}
