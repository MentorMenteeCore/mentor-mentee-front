import { Link, Outlet, useNavigate } from "react-router-dom";
import { Search } from "../assets/icons";
import { useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropDownOpen] = useState(false);

  const accessToken =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      let apiUrl = `${import.meta.env.VITE_API_KEY}/search`;
      const params = {};

      if (isLoggedIn) {
        apiUrl += `/user`;
        params.nickname = search;
      } else {
        params.departmentName = search;
        const departmentName = search;
        navigate(`/?departmentName=${encodeURIComponent(departmentName)}`);
      }

      const response = await axios.get(apiUrl, {
        params: params,
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });

      setSearchResults(response.data);
    } catch (error) {
      console.log("API 호출 에러:", error);
      setSearchResults([]);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // const accessToken =
      //   localStorage.getItem("token") || sessionStorage.getItem("token");

      // // Axios delete 요청 시 헤더 추가
      // await axios.delete(`${import.meta.env.VITE_API_KEY}/user/logout`, {
      //   data: {
      //     token: accessToken, // 필요한 데이터 추가
      //   },
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 추가
      //   },
      // });

      // // 토큰 제거
      // localStorage.removeItem("token");
      // sessionStorage.removeItem("token");

      navigate("/login");
    } catch (error) {
      console.log(
        "로그아웃 중 오류 발생:",
        error.response ? error.response.data : error
      );
    }
  };

  const toggleDropdown = () => {
    setIsDropDownOpen((prev) => !prev);
  };

  const resetSearch = () => {
    setSearch("");
    setSearchResults([]);
    window.location.replace("/"); //느린 게 단점인데... 나중에 고쳐보자
    // navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        !event.target.closest(".dropdown-menu") &&
        !event.target.closest(".profile-box")
      ) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      {isLoggedIn ? (
        <div className="grid grid-cols-3 p-5 fixed top-0 left-0 right-0 z-50 bg-white">
          <div className="flex gap-4 col-span-2 items-center">
            <ul>
              <li>
                <Link to={"/"} className="text-2xl" onClick={resetSearch}>
                  LOGO
                </Link>
              </li>
            </ul>
            <div className="w-full border-lightGray01 rounded-[20px] border-2 h-[41px] flex items-center justify-between p-2 pl-4">
              <input
                type="text"
                className="outline-none w-full"
                placeholder="찾고 싶은 유저 닉네임을 검색하세요"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <button onClick={handleSearch}>
                <Search />
              </button>
            </div>
          </div>

          <div className="grid justify-self-end items-center col-span-1">
            <ul className="grid grid-cols-5 justify-items-center items-center gap-2">
              <li>
                <Link to={"/"}>메세지</Link>
              </li>
              <li>
                <Link to={"/"}>알림</Link>
              </li>
              <li>
                <div
                  onClick={toggleDropdown}
                  className="bg-lightGray01 rounded-[10px] px-[25px] py-[15px] cursor-pointer"
                >
                  -
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-10 mt-2 bg-white border-2 border-black/50 rounded-xl shadow-md py-2 dropdown-menu">
                    <div className="pl-5 pr-12 py-2 hover:bg-lightGray01/50 cursor-pointer">
                      <Link
                        to="/profile/mentor"
                        onClick={() => {
                          toggleDropdown();
                        }}
                      >
                        내 정보
                      </Link>
                    </div>
                    <div
                      className="pl-5 pr-12 py-2 hover:bg-lightGray01/50 cursor-pointer"
                      onClick={() => {
                        handleLogout();
                        toggleDropdown();
                      }}
                    >
                      로그아웃
                    </div>
                  </div>
                )}
              </li>
              <li>
                <Link to={"/"}>
                  <img src="/money.png" alt="씨앗" className="mt-2 ml-2" />
                </Link>
              </li>
              <li>
                <Link to={"/setting/information"}>
                  <img src="/setting.png" alt="설정" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 p-5 fixed top-0 left-0 right-0 z-50 bg-white">
          <div className="flex gap-4 col-span-2">
            <ul>
              <li>
                <Link to={"/"} className="text-2xl" onClick={resetSearch}>
                  LOGO
                </Link>
              </li>
            </ul>
            <div className="w-full border-lightGray01 rounded-[20px] border-2 h-[41px] flex items-center justify-between p-2 pl-4">
              <input
                type="text"
                className="outline-none w-full"
                placeholder="학과를 입력해주세요."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                    setSearchResults([]);
                  }
                }}
              />
              <button onClick={handleSearch}>
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
      )}
      <div className="pt-[100px]">
        <Outlet />
      </div>
    </>
  );
}
