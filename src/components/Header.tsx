import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Search } from "../assets/icons";
import { useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchNickname, setSearchNickname] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropDownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userNickname: "",
    userEmail: "",
    userDepartment: "",
    yearInUni: "",
    userImageUrl: "",
  });
  const [isNicknameSearchPage, setIsNicknameSearchPage] = useState(false);
  const [selectedSearchType, setSelectedSearchType] =
    useState("departmentName");

  const accessToken =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const navigate = useNavigate();
  const locaton = useLocation();

  const handleSearch = async () => {
    // 검색어 없을 경우
    if (!searchDepartment.trim() && !searchNickname.trim()) {
      setSearchResults([]);
      console.log("검색어가 없으므로 요청을 보내지 않습니다.");
      return;
    }

    setSearchResults([]); // 이전 결과 삭제

    try {
      console.log("Search button clicked");
      let apiUrl = `${import.meta.env.VITE_API_KEY}/search`;
      const params = {};

      if (selectedSearchType === "departmentName" && searchDepartment.trim()) {
        //학과 검색
        params.departmentName = searchDepartment;
        navigate(`/?departmentName=${encodeURIComponent(searchDepartment)}`);
      } else if (selectedSearchType === "nickname" && searchNickname.trim()) {
        //닉네임 검색
        apiUrl = `${import.meta.env.VITE_API_KEY}/search/user`;
        params.nickname = searchNickname;
      }

      const response = await axios.get(apiUrl, {
        params: params,
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });

      console.log("API 요청 URL:", apiUrl);
      console.log("요청 파라미터:", params);
      console.log(response.data);

      setSearchResults(response.data);
    } catch (error) {
      console.log("API 호출 에러:", error);
      setSearchResults([]);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
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

  // 내 정보 경로
  const handleProfileClick = async () => {
    try {
      const response = await api.get(`/user?page=0&size=100`);
      const data = response.data;
      console.log(data);

      if (data.courseDetails && data.availabilities) {
        navigate("/profile/mentor/edit");
      } else {
        navigate("/profile/mentee/edit");
      }
    } catch (error) {
      console.error("프로필 정보를 불러오는 중 오류 발생: ", error);
    }
  };

  const resetSearch = () => {
    setSearchDepartment("");
    setSearchResults([]);
    navigate("/");
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!accessToken) {
        console.error("Access token is missing");
        return;
      }
      try {
        const response = await api.get(`/user/information`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const {
          userNickname,
          userEmail,
          userDepartment,
          yearInUni,
          userImageUrl,
        } = response.data;
        setUserInfo({
          userNickname,
          userEmail,
          userDepartment,
          yearInUni,
          userImageUrl,
        });
      } catch (error) {
        console.error("Failed to fetch user information:", error);
      }
    };
    fetchUserInfo();
  }, [userInfo.userImageUrl]);
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
              <div className="flex w-full gap-2 py-4">
                <div className="flex items-center flex-grow">
                  <button
                    className={`px-3 py-1 rounded-full flex items-center justify-center text-sm w-24 ${
                      selectedSearchType === "departmentName"
                        ? "bg-gray-300"
                        : ""
                    }`}
                    onClick={() => setSelectedSearchType("departmentName")}
                  >
                    학과명
                  </button>
                  <input
                    type="text"
                    className="outline-none w-full ml-2"
                    placeholder="학과를 입력해주세요."
                    value={searchDepartment}
                    onClick={() => setSelectedSearchType("departmentName")}
                    onChange={(e) => setSearchDepartment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                  />
                </div>

                <div className="flex items-center flex-grow">
                  <button
                    className={`px-3 py-1 rounded-full flex items-center justify-center text-sm w-24 ${
                      selectedSearchType === "nickname" ? "bg-gray-300" : ""
                    }`}
                    onClick={() => setSelectedSearchType("nickname")}
                  >
                    닉네임
                  </button>
                  <input
                    type="text"
                    className="outline-none w-full ml-2"
                    placeholder="닉네임을 입력해주세요."
                    value={searchNickname}
                    onClick={() => setSelectedSearchType("nickname")}
                    onChange={(e) => setSearchNickname(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                  />
                </div>
              </div>

              <button onClick={handleSearch} className="ml-2">
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
                <img
                  onClick={toggleDropdown}
                  className="bg-lightGray01 rounded-[10px] w-[60px] h-[60px] rounded-full cursor-pointer"
                  src={userInfo.userImageUrl}
                />

                {isDropdownOpen && (
                  <div className="absolute right-10 mt-2 bg-white border-2 border-black/50 rounded-xl shadow-md py-2 dropdown-menu">
                    <div className="pl-5 pr-12 py-2 hover:bg-lightGray01/50 cursor-pointer">
                      <Link
                        to="/profile/mentor"
                        onClick={() => {
                          toggleDropdown();
                          handleProfileClick();
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
            <div className="w-full border-lightGray01 rounded-[20px] border-2 h-[41px] flex items-center justify-start p-2 pl-4">
              <button
                className={`px-3 py-1 rounded-full flex items-center justify-center text-sm w-24 ${
                  selectedSearchType === "departmentName" ? "bg-gray-300" : ""
                }`}
                onClick={() => setSelectedSearchType("departmentName")}
              >
                학과명
              </button>
              <input
                type="text"
                className="outline-none w-full ml-2"
                placeholder="학과를 입력해주세요."
                value={searchDepartment}
                onClick={() => setSelectedSearchType("departmentName")}
                onChange={(e) => setSearchDepartment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
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
