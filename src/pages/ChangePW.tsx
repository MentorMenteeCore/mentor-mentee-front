export default function ChangePW() {
  function handleClick(event) {
    event.preventDefault();
    alert("회원 탈퇴가 완료되었습니다. ");
    window.location.href = "/";
  }
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
                  placeholder="변경할 비밀번호를 한번 더 입력해주세요."
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-red01 opacity-50 text-white text-2xl rounded-[10px] py-2 px-5 w-max justify-self-end"
            onClick={handleClick}
          >
            변경하기
          </button>
        </div>
      </div>
    </>
  );
}
