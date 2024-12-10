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
  // const [isNicknameSearchPage, setIsNicknameSearchPage] = useState(false);
  const [selectedSearchType, setSelectedSearchType] =
    useState("departmentName");

  const accessToken =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const navigate = useNavigate();

  const fetchSearchResults = async (apiUrl, params) => {
    try {
      const response = await axios.get(apiUrl, {
        params: params,
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      // setSearchDepartment("");
      // setSearchNickname("");
      console.log("API 요청 URL:", apiUrl);
      console.log("요청 파라미터:", params);
      console.log("응답 데이터", response.data);

      return response.data;
    } catch (error) {
      console.error("API 호출 에러: ", error);
      return null;
    }
  };

  const handleSearch = async () => {
    // 검색어 없을 경우
    if (!searchDepartment.trim() && !searchNickname.trim()) {
      setSearchResults([]);
      console.log("검색어가 없으므로 요청을 보내지 않습니다.");
      return;
    }

    setSearchResults([]); // 이전 결과 삭제

    if (selectedSearchType === "departmentName" && searchDepartment.trim()) {
      //학과 검색
      const apiUrl = `${import.meta.env.ViTE_API_KEY}/search`;
      const params = { departmentName: searchDepartment };

      const data = await fetchSearchResults(apiUrl, params);
      if (data) {
        setSearchResults(data);
        navigate(`?departmentName=${encodeURIComponent(searchDepartment)}`);
      }
    } else if (selectedSearchType === "nickname" && searchNickname.trim()) {
      const apiUrl = `${import.meta.env.VITE_API_KEY}/search/user`;
      const params = { nickname: searchNickname };

      const user = await fetchSearchResults(apiUrl, params);
      if (user) {
        console.log("유저의 정보", user);
        if (user.mentorId) {
          navigate(
            `/profile/mentor/${encodeURIComponent(user.nickName)}&size=100`
          );
        } else if (user.menteeNickName) {
          navigate(
            `/profile/mentee/${encodeURIComponent(
              user.menteeNickName
            )}&size=100`
          );
        } else {
          alert("유저의 역할 정보를 찾을 수 없습니다.");
        }
      } else {
        alert("해당 닉네임에 대한 유저를 찾을 수 없습니다.");
      }
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
        console.log(data);
      } else {
        console.log(data);
        navigate("/profile/mentee/edit");
      }
    } catch (error) {
      console.error("프로필 정보를 불러오는 중 오류 발생: ", error);
    }
  };

  const resetSearch = () => {
    setSearchDepartment("");
    setSearchResults([]);
    window.location.replace("/");
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
                    className={`px-3 py-1 rounded-full flex items-center justify-center md:text-sm w-24 sm:text-xs ${
                      selectedSearchType === "departmentName"
                        ? "bg-gray-300"
                        : ""
                    } `}
                    onClick={() => {
                      setSelectedSearchType("departmentName"),
                        setSearchNickname("");
                    }}
                  >
                    학과명
                  </button>
                  <input
                    type="text"
                    className="outline-none w-full ml-2 md:text-sm sm:text-xs"
                    placeholder="학과를 입력해주세요."
                    value={searchDepartment}
                    onClick={() => {
                      setSelectedSearchType("departmentName"),
                        setSearchNickname("");
                    }}
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
                    className={`px-3 py-1 rounded-full flex items-center justify-center md:text-sm w-24 sm:text-xs ${
                      selectedSearchType === "nickname" ? "bg-gray-300" : ""
                    }`}
                    onClick={() => {
                      setSelectedSearchType("nickname"),
                        setSearchDepartment("");
                    }}
                  >
                    닉네임
                  </button>
                  <input
                    type="text"
                    className="outline-none w-full ml-2 md:text-sm sm:text-xs"
                    placeholder="닉네임을 입력해주세요."
                    value={searchNickname}
                    onClick={() => {
                      setSelectedSearchType("nickname"),
                        setSearchDepartment("");
                    }}
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
            <ul className="grid grid-cols-4 justify-items-center items-center md:gap-3 sm:gap-1 md:text-sm sm:text-xs">
              <li>
                <Link to={"/"}>메세지</Link>
              </li>
              <li>
                <Link to={"/"}>알림</Link>
              </li>
              <li>
                <img
                  onClick={toggleDropdown}
                  className="bg-lightGray01 md:w-[60px] md:h-[60px] sm:w-[40px] sm:h-[40px] rounded-full cursor-pointer shadow-md object-cover"
                  src={userInfo.userImageUrl}
                />

                {isDropdownOpen && (
                  <div className="absolute right-20 mt-2 bg-white border-2 border-black/50 rounded-xl shadow-md py-2 dropdown-menu text-sm">
                    <div className="pl-5 pr-12 py-2 hover:bg-lightGray01/50 cursor-pointer">
                      <button
                        onClick={() => {
                          toggleDropdown();
                          handleProfileClick();
                        }}
                      >
                        내 정보
                      </button>
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
              {/* <li>
                <Link to={"/"}>
                  <img src="/money.png" alt="씨앗" className="mt-2 ml-2" />
                </Link>
              </li> */}
              <li>
                <Link to={"/setting/information"}>
                  <img
                    src="/setting.png"
                    alt="설정"
                    className="ml-3 sm:w-[30px] sm:h-[30px] md:w-[40px] md:h-[40px]"
                  />
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
