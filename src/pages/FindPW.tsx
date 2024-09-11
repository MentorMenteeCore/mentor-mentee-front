import { Link } from "react-router-dom";

const FindPW = () => {
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
            <div className="grid gap-4">
              <h2 className="text-black text-2xl underline pb-2">
                비밀번호 찾기
              </h2>
              <input
                type="email"
                placeholder="가입된 학교 이메일"
                className="bg-lightGray01/50 placeholder-black/50 text-2xl rounded-[10px] py-3 px-6"
              />
              <button className="border-[1px] bg-lightGray02 border-black rounded-[10px] text-black text-2xl py-3 px-6">
                비밀번호 재설정 링크 받기
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
