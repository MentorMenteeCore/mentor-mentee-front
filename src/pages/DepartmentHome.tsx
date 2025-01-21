import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function DepartmentHome() {
  const { departmentId } = useParams();
  const GRADES = ["1학년", "2학년", "3학년", "4학년"];
  const GRADE_MAP = {
    "1학년": "FRESHMAN",
    "2학년": "SOPHOMORE",
    "3학년": "JUNIOR",
    "4학년": "SENIOR",
  };
  const [course, setCourse] = useState({
    courseDtoList: [],
    courseName: "",
    mentors: [],
    userYearInUni: "",
    totalPages: 0,
    lastPageOrNot: true,
    currentPageNum: 0,
    departmentName: "",
  });
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPage, setSelectedPage] = useState(0);
  const [isDropdownOpen, setIsDropDownOpen] = useState("");
  const [selectedSort, setSelectedSort] = useState("nickname");
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`mentorlist/${departmentId}`);
        setCourse(response.data);

        if (response.data.userYearInUni) {
          const initialGrade = GRADES[response.data.userYearInUni - 1];
          setSelectedGrade(initialGrade);
        }

        if (response.data.courseDtoList.length > 0) {
          const firstCourse = response.data.courseDtoList[0];
          setSelectedCourse(firstCourse.courseId);

          // 기본 과목 데이터와 멘토 리스트 함께 설정
          const mentorsResponse = await api.get(
            `/mentorlist/${departmentId}?courseId=${firstCourse.courseId}&size=4`
          );

          setCourse({
            ...response.data,
            courseName: firstCourse.courseName,
            mentors: mentorsResponse.data.mentors || [],
          });

          // setSelectedCourse(firstCourse.courseId);
        } else {
          setCourse(response.data);
        }
      } catch (error) {
        console.log("Error fetching mentors:", error);
      }
    };

    if (departmentId) {
      fetchCourse();
    }
  }, [departmentId]);

  // 과목이 선택되었을 때 과목명과 멘토 데이터 업데이트
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchMentorsForSelectedCourse = async () => {
      try {
        const response = await api.get(
          `/mentorlist/${departmentId}?courseId=${selectedCourse}&size=4`
        );
        setCourse((prev) => ({
          ...prev,
          mentors: response.data.mentors || [],
          totalPages: response.data.totalPages || "",
        }));
      } catch (error) {
        console.log("Error fetching mentors for selected course:", error);
      }
    };

    fetchMentorsForSelectedCourse();
  }, [selectedCourse, departmentId]);

  const handleSelectGrade = (e) => {
    const selectedIndex = e.target.value; // 선택한 인덱스
    const grade = GRADES[selectedIndex]; // 학년 텍스트 (예: "2학년")
    setSelectedSort("nickname");
    setSelectedGrade(grade); // 선택된 학년 상태 업데이트
    fetchCoursesByGrade(GRADE_MAP[grade]); // 문자열로 매핑 후 API 요청
  };

  const fetchCoursesByGrade = async (gradeString: string) => {
    try {
      const response = await api.get(
        `/mentorlist/${departmentId}?selectedYear=${gradeString}&size=4`
      );
      console.log("학년 선택에 따른 과목: ", response.data);
      setCourse({
        ...course,
        courseDtoList: response.data.courseDtoList || [],
        mentors: response.data.mentors || [],
      });

      if (response.data.courseDtoList.length > 0) {
        const firstCourse = response.data.courseDtoList[0];
        setSelectedCourse(firstCourse.courseId);
        setCourse((prev) => ({
          ...prev,
          courseName: firstCourse.courseName,
        }));
      }
    } catch (error) {
      console.log("Error fetching courses: ", error);
    }
  };

  const handleSelectCourse = async (courseId: string) => {
    if (!courseId) return;

    setSelectedCourse(courseId);

    const selectedCourse = course.courseDtoList.find(
      (item) => item.courseId === courseId
    );
    if (selectedCourse) {
      setCourse((prev) => ({
        ...prev,
        courseName: selectedCourse.courseName,
      }));
    }

    // fetchCourses(GRADE_MAP[selectedGrade], courseId, selectedPage);
  };

  const toggleDropdown = () => {
    setIsDropDownOpen((prev) => !prev);
  };

  const handleSortRequest = async (sortBy: string) => {
    if (!selectedCourse) {
      console.error("Course ID is not selected");
      return;
    }

    const url = `/mentorlist/${departmentId}?sortBy=${sortBy}&page=0&courseId=${selectedCourse}`;
    try {
      const response = await api.get(url);
      if (response.status === 200) {
        const data = await response.data;
        console.log("API Response: ", data);

        setCourse((prev) => ({
          ...prev,
          mentors: data.mentors || [],
        }));

        setSelectedSort(sortBy);
      } else {
        console.error("API Error", response);
      }
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  useEffect(() => {
    setSelectedSort("nickname");
  }, [selectedCourse]);

  const handlePageChange = async (pageNum: number) => {
    if (pageNum < 0 || pageNum >= course.totalPages) return;

    const pageToSen = pageNum;

    setSelectedPage(pageNum);

    try {
      const response = await api.get(
        `/mentorlist/${departmentId}?courseId=${selectedCourse}&page=${pageToSen}&size=4`
      );

      setCourse((prev) => ({
        ...prev,
        mentors: response.data.mentors || [],
        currentPageNum: pageNum,
        lastPageOrNot: response.data.lastPageOrNot,
      }));
    } catch (error) {
      console.log("Error fetching data for page change: ", error);
    }
  };

  const handleMentorClick = async (nickname: string) => {
    const encodedNickname = encodeURIComponent(nickname);
    console.log(nickname);
    console.log(encodedNickname);
    try {
      const response = await api.get(
        `/mentordetails?nickName=${encodedNickname}&page=0`
      );

      navigate(`/profile/mentor/${encodeURIComponent(nickname)}`);
    } catch (error) {
      console.error("Fetching mentor detail error: ", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-5 px-7">
        <div className="pl-5">
          <p className="mb-2 font-bold text-xl">{course.departmentName}</p>
          <div className="bg-black h-1 mb-2"></div>
          <div>
            <select
              name="학년"
              onChange={handleSelectGrade}
              value={GRADES.indexOf(selectedGrade)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm mb-4 w-full"
            >
              {GRADES.map((grade, index) => (
                <option value={index}>{grade}</option>
              ))}
            </select>
            {/* 과목 리스트 */}
            <ul className="list-disc text-sm px-2">
              {course.courseDtoList.length > 0 ? (
                course.courseDtoList.map((courseItem) => (
                  <li
                    key={courseItem.courseId}
                    value={courseItem.courseId}
                    className={`py-1 list-none cursor-pointer ${
                      selectedCourse === courseItem.courseId ? "font-bold" : ""
                    }`}
                    onClick={() => handleSelectCourse(courseItem.courseId)}
                  >
                    <p>{courseItem.courseName}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">과목이 없습니다.</p>
              )}
            </ul>
          </div>
        </div>
        <div className=" col-span-4 px-10 gap-2 mt-2">
          <div className="flex justify-between items-center pt-3 pr-2 pl-5 mb-10">
            <div className=" font-bold md:text-2xl sm:text-xl pl-5">
              {course.courseName}
            </div>
            <div className="flex items-center justify-end gap-2">
              <div className="bg-lightGray01 text-black text-opacity-100 font-bold py-2 px-3 rounded-xl mr-5">
                <Link to={"/mentorList"}>모든 멘토 보기</Link>
              </div>
              <img
                src="/sort.png"
                className="w-[30px] h-[30px] cursor-pointer"
                onClick={toggleDropdown}
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute right-16 top-40 mt-2 bg-white border-2 border-black/50 rounded-xl shadow-md py-2 dropdown-menu">
                <div
                  className={`pl-5 pr-12 py-2 ${
                    selectedSort === "nickname" ? "text-red01 " : ""
                  } hover:bg-lightGray01/50 cursor-pointer`}
                >
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
                  className={`pl-5 pr-12 py-2 ${
                    selectedSort === "grade" ? "text-red01 " : ""
                  } hover:bg-lightGray01/50 cursor-pointer`}
                  onClick={() => {
                    toggleDropdown();
                    handleSortRequest("grade");
                  }}
                >
                  학점순
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
              </div>
            )}
          </div>

          {course.mentors.length > 0 ? (
            course.mentors.map((mentor, id) => (
              <div
                key={id}
                className="flex justify-between items-center pl-10 cursor-pointer"
                onClick={() => handleMentorClick(mentor.nickName)}
              >
                <div className="flex items-center">
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
                <div className="justify-end align-center pr-5">
                  <p>학점</p>
                  <p className="font-bold">{mentor.gradeStatus}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="pl-10"> 해당 과목을 등록한 멘토가 없습니다. </p>
          )}
          <div className="flex justify-center items-center space-x-2 py-4 bg-white  border-gray-300 fixed bottom-0 left-40 right-0 z-10">
            {course.totalPages === 0 ? (
              <p> </p>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  className="w-10 h-10 flex justify-center items-center rounded-full hover:bg-gray-300 disabled:bg-white "
                  onClick={() => handlePageChange(course.currentPageNum - 1)}
                  disabled={course.currentPageNum === 0}
                >
                  &laquo;
                </button>
                {/* 페이지 번호 버튼들 */}
                {[...Array(course.totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`w-10 h-10 flex justify-center items-center rounded-full ${
                      course.currentPageNum === index
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
                  onClick={() => handlePageChange(course.currentPageNum + 1)}
                  disabled={course.lastPageOrNot === true}
                >
                  &raquo;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
