import { Link } from "react-router-dom";

const Signin = () => {
  function handleClick(event) {
    event.preventDefault();
    window.location.href = "/";
  }

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
          <form className="flex justify-center content-between">
            <div className="grid gap-5">
              <input
                type="email"
                placeholder="이메일"
                className="bg-[#D9D9D9]/50 placeholder-black/50 text-2xl rounded-[10px] py-3 pl-[25px]"
              />
              <input
                type="password"
                placeholder="비밀번호"
                className="bg-[#D9D9D9]/50 placeholder-black/50 text-2xl rounded-[10px] py-3 pl-[25px]"
              />
              <button
                className="border-[1px] bg-[#F5F5F5] border-black rounded-[10px] text-black text-[24px] py-3"
                type="submit"
                onClick={handleClick}
              >
                LOGO 로그인
              </button>
              <div className="flex justify-between content-center gap-20">
                <div className="flex justify-left content-center">
                  <input
                    type="checkbox"
                    id="keepLogin"
                    className="w-[24px] h-[24px] mt-[5px] mr-[18px]"
                  />
                  <label
                    htmlFor="keepLogin"
                    className="text-2xl text-lightGray03"
                  >
                    로그인 유지
                  </label>
                </div>
                <Link to={"/login/findpw"}>
                  <p className="text-[24px] text-gray01">비밀번호 찾기</p>
                </Link>
              </div>
              <div className="flex justify-center">
                <Link to={"/join/agree"}>
                  <p className="text-[24px] pt-[103px] text-gray01 underline">
                    회원가입
                  </p>
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
