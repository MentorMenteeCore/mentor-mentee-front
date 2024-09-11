import { Link, Outlet, useLocation } from "react-router-dom";

const SettingNavigation = () => {
  const location = useLocation().pathname;
  return (
    <>
      <div className="grid grid-cols-5 gap-12 px-5">
        <div>
          <p className="pb-2 text-2xl">계정 설정</p>
          <div className="bg-black h-1"></div>
          <div className="grid grid-rows-3 gap-y-2 text-xl pt-4 pl-6">
            <Link
              to="/setting/information"
              className={
                location.includes("information")
                  ? "underline underline-offset-4"
                  : ""
              }
            >
              내 정보
            </Link>
            <Link
              to="/setting/change-pw"
              className={
                location.includes("change-pw")
                  ? "underline underline-offset-4"
                  : ""
              }
            >
              비밀번호 변경
            </Link>
            <Link
              to="/setting/delete-account"
              className={
                location.includes("delete-account")
                  ? "underline underline-offset-4"
                  : ""
              }
            >
              회원 탈퇴
            </Link>
          </div>
        </div>
        <div className="grid col-span-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SettingNavigation;
