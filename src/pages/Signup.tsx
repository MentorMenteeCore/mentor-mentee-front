import { Link } from "react-router-dom";

const Signup = () => {
  function handleClick(event) {
    event.preventDefault();
    window.location.href = "/join/info2";
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
            <div className="bg-lightGray02 border-[1px] border-[#333333]/30 pt-14 px-8 pb-6">
              <form className="grid gap-5">
                <input
                  type="text"
                  placeholder="성명"
                  className="bg-lightGray01 placeholder-black text-2xl rounded-[10px] opacity-50 pl-[21px] py-4"
                />
                <input
                  type="text"
                  placeholder="학교 이메일"
                  className="bg-lightGray01 placeholder-black text-2xl rounded-[10px] opacity-50 pl-[21px] py-4"
                />
                <div className="flex justify-between gap-3 mb-5">
                  <input
                    type="text"
                    placeholder="인증번호(6자리)"
                    className="bg-lightGray01 placeholder-black text-2xl rounded-[10px] opacity-50 py-4 pl-[21px]"
                  />
                  <button
                    type="button"
                    className="bg-red01 opacity-50 text-white text-2xl  rounded-[20px] py-3 px-3"
                  >
                    인증번호 발송
                  </button>
                </div>
                <button
                  onClick={handleClick}
                  className="border-[1px] bg-transparent border-black rounded-[10px] text-black text-2xl py-3 "
                >
                  확인
                </button>
              </form>
              <div className="flex justify-center content-end pt-[166px]">
                <Link to={"/login"}>
                  <p className="text-xl hover:underline">
                    이미 LOGO 회원이신가요?
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
