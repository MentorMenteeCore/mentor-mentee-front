import { Link, Outlet } from "react-router-dom";
import { Search } from "../assets/icons";

export default function Skeleton() {
  return (
    <>
      <div className="grid grid-cols-3 p-5 fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="flex gap-4 col-span-2">
          <ul className="">
            <li>
              <Link to={"/"} className="text-2xl">
                LOGO
              </Link>
            </li>
          </ul>
          <div className="w-full border-lightGray01 rounded-[20px] border-2 h-[41px] flex items-center justify-between p-2 pl-4">
            <input type="text" className="outline-none w-full" />
            <button>
              <Search />
            </button>
          </div>
        </div>

        <div className="grid justify-self-end self-center">
          <ul className="grid grid-cols-2">
            <li>
              <Link to={"/login"}>로그인</Link>
            </li>
            <li>
              <Link
                to={"/join/agree"}
                className="bg-lightGray01 rounded-[10px] px-[13px] py-[6px]"
              >
                회원가입
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="pt-[80px]">
        <Outlet />
      </div>
    </>
  );
}
