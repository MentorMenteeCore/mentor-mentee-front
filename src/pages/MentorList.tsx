import { useEffect, useState } from "react";
import api from "../services/api";

export default function MentorList() {
  const [mentors, setMentors] = useState({
    currentPageNum: "",
    lastPageOrNot: false,
    mentorDtos: [],
    totalPages: "",
  });
  const [isDropdownOpen, setIsDropDownOpen] = useState("");

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await api.get(`/allmentorlist`);
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

  const handleSortRequest = async (sortBy) => {
    const url = `/allmentorlist?sortBy=${sortBy}`;

    try {
      const response = await api.get(url);
      if (response.status === 200) {
        const data = await response.data;
        console.log("API Respons: ", data);
        setMentors(data);
      } else {
        console.error("API Error: ", response);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  return (
    <>
      <div className="col-span-4 px-10 gap-2">
        <div className="flex justify-end items-center pt-5 pr-2 pl-5">
          <img
            src="/sort.png"
            className="w-[30px] h-[30px] cursor-pointer"
            onClick={toggleDropdown}
          />

          {isDropdownOpen && (
            <div className="absolute right-13 top-40 mt-2 bg-white border-2 border-black/50 rounded-xl shadow-md py-2 dropdown-menu">
              <div className="pl-5 pr-12 py-2 hover:bg-lightGray01/50 cursor-pointer">
                <button
                  onClick={() => {
                    toggleDropdown();
                    handleSortRequest("nickname");
                  }}
                >
                  닉네임순
                </button>
              </div>
              <div
                className="pl-5 pr-12 py-2 hover:bg-lightGray01/50 cursor-pointer"
                onClick={() => {
                  toggleDropdown();
                  handleSortRequest("year");
                }}
              >
                학년순
              </div>
              <div
                className="pl-5 pr-12 py-2 hover:bg-lightGray01/50 cursor-pointer"
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
            <div
              key={id}
              className="flex justify-between items-center pl-10 mb-10"
            >
              <div className="flex items-center gap-5">
                <div>
                  <img
                    src={mentor.profileUrl}
                    className="rounded-full w-[100px] h-[100px]"
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
    </>
  );
}
