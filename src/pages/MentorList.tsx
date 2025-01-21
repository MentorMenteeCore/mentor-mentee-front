import { useEffect, useState } from "react";
import api from "../services/api";
import useWindowHeight from "../components/useWindowHeight";

export default function MentorList() {
  const [mentors, setMentors] = useState({
    currentPageNum: 1,
    lastPageOrNot: false,
    mentorDtos: [],
    totalPages: 0,
  });
  const [isDropdownOpen, setIsDropDownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("nickname");
  const [selectedPage, setSelectedPage] = useState(0);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await api.get(`/allmentorlist?page=0&size=5`);
        console.log(response.data);
        setMentors(response.data);
      } catch (error) {
        console.log("Error fetching mentors: ", error);
      }
    };

    fetchMentors();
  }, []);

  const toggleDropdown = () => {
    setIsDropDownOpen((prev) => !prev);
  };

  const handleSortRequest = async (sortBy: string) => {
    const url = `/allmentorlist?sortBy=${sortBy}&page=${selectedPage}&size=5`;

    try {
      const response = await api.get(url);
      if (response.status === 200) {
        const data = await response.data;
        console.log("API Respons: ", data);
        setMentors(data);
        setSelectedSort(sortBy);
      } else {
        console.error("API Error: ", response);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  const handlePageChange = async (pageNum: number) => {
    if (pageNum < 0 || pageNum > mentors.totalPages) return;

    setSelectedPage(pageNum);

    try {
      const response = await api.get(
        `/allmentorlist?sortBy=${selectedSort}&page=${pageNum}&size=5`
      );

      setMentors((prev) => ({
        ...prev,
        mentorDtos: response.data.mentorDtos || [],
        currentPageNum: pageNum + 1,
        lastPageOrNot: response.data.lastPageOrNot,
        totalPages: response.data.totalPages,
      }));
      console.log("mentors: ", mentors);
    } catch (error) {
      console.log("Error fetching data for page change: ", error);
    }
  };

  //커스텀 훅 사용
  const windowHeight = useWindowHeight();

  return (
    <>
      <div className="col-span-4 px-20 gap-2" style={{ height: windowHeight }}>
        {/*px-10이었음 !*/}
        <div className="flex justify-end items-center pt-5 pr-2 pl-5">
          <img
            src="/sort.png"
            className="w-[30px] h-[30px] cursor-pointer"
            onClick={toggleDropdown}
          />

          {isDropdownOpen && (
            <div className="absolute right-13 top-40 mt-2 bg-white border-2 border-black/50 rounded-xl shadow-md py-2 dropdown-menu">
              <div
                onClick={() => {
                  toggleDropdown();
                  handleSortRequest("nickname");
                }}
                className={`pl-5 pr-12 py-2 ${
                  selectedSort === "nickname" ? "text-red01 " : ""
                } hover:bg-lightGray01/50 cursor-pointer`}
              >
                닉네임순
              </div>
              <div
                className={`pl-5 pr-12 py-2 ${
                  selectedSort === "year" ? "text-red01 " : ""
                } hover:bg-lightGray01/50 cursor-pointer`}
                onClick={() => {
                  toggleDropdown();
                  handleSortRequest("year");
                }}
              >
                학년순
              </div>
              <div
                className={`pl-5 pr-12 py-2 ${
                  selectedSort === "department" ? "text-red01 " : ""
                } hover:bg-lightGray01/50 cursor-pointer`}
                onClick={() => {
                  toggleDropdown();
                  handleSortRequest("department");
                }}
              >
                학과이름순
              </div>
            </div>
          )}
        </div>
        {mentors.mentorDtos.length > 0 ? (
          mentors.mentorDtos.map((mentor, id) => (
            <div key={id} className="flex items-center mb-7 md:ml-60">
              <div className="flex justify-between items-center gap-14">
                <div>
                  <img
                    src={mentor.profileUrl}
                    className="rounded-full w-[60px] h-[60px]"
                  />
                </div>
                <div className="ml-5 grid gap-2">
                  <p className="font-bold text-xl">{mentor.nickName}</p>
                  <p className="text-m">
                    {mentor.yearInUni}학년 / {mentor.departmentName}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="pl-5"> 아직 등록된 멘토가 없습니다. </p>
        )}
      </div>
      <div className="flex justify-center items-center mt-6 space-x-2 py-4 bg-white  border-gray-300 fixed bottom-0 left-0 right-0 z-10">
        {mentors.totalPages === 0 ? null : (
          <div className="flex items-center space-x-2">
            <button
              className="w-10 h-10 flex justify-center items-center rounded-full hover:bg-gray-300 disabled:bg-white "
              onClick={() => handlePageChange(mentors.currentPageNum - 2)}
              disabled={mentors.currentPageNum === 1}
            >
              &laquo;
            </button>
            {/* 페이지 번호 버튼들 */}
            {[...Array(mentors.totalPages)].map((_, index) => (
              <button
                key={index}
                className={`w-10 h-10 flex justify-center items-center rounded-full ${
                  mentors.currentPageNum === index + 1
                    ? "bg-blue-500 text-white"
                    : " hover:bg-gray-300"
                }`}
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="w-10 h-10 flex justify-center items-center rounded-full hover:bg-gray-300 disabled:bg-white "
              onClick={() => handlePageChange(mentors.currentPageNum)}
              disabled={mentors.lastPageOrNot === true}
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
    </>
  );
}
