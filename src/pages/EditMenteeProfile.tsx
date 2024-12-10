import { useEffect, useState } from "react";
import api from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import { loadDepartments } from "../components/SaveDepartments";

const EditMenteeProfile = () => {
  const [menteeData, setMenteeData] = useState({
    menteeImageUrl: "",
    selfIntroduction: "",
    userCourseList: [],
    menteePreferredTeachingMethodDtoList: [],
    menteeNickName: "",
    gradeStatus: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newCourseList, setNewCourseList] = useState([]);
  const [newPreferMethodList, setNewPreferMethodList] = useState([]);
  const [deletedCourseList, setDeletedCourseList] = useState([]);
  const [showNewCourseList, setShowNewCourseList] = useState(false);
  const [showNewMethodList, setShowNewMethodList] = useState(false);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [departmentCourse, setDepartmentCourse] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const fetchData = async (courseName: string) => {
    try {
      const response = await api.get(`/courses?departmentName=${courseName}`);
      console.log(response.data);
      setDepartmentCourse(response.data.course);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // selectedOption이 변경될 때마다 API 요청
  useEffect(() => {
    if (selectedDepartment) {
      fetchData(selectedDepartment);
    }
  }, [selectedDepartment]);

  // Mentee Data 불러오기 (페이지 들어올 때마다 실행[location])
  const fetchMenteeProfile = async () => {
    try {
      const response = await api.get("/user?page=0&size=100");
      setMenteeData(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch mentee profile", error);
      return null;
    }
  };

  useEffect(() => {
    fetchMenteeProfile();
  }, [location]);

  useEffect(() => {
    const departments = loadDepartments();
    setDepartmentNames(departments);
  }, []);

  if (!menteeData) {
    return <div>Failed to load profile</div>;
  }

  // 수정 버튼 클릭 시 수정 가능하게 변경
  const handleEdit = () => {
    setIsEditing(true);
  };

  const convertGradeSwitch = (gradeStatus: string) => {
    // gradeStatus가 null인 경우 기본값 설정
    if (!gradeStatus) {
      return ""; // 또는 "DEFAULT"로 설정
    }

    switch (gradeStatus) {
      case "APLUS":
        return "A+";
      case "A":
        return "A0";
      case "BPLUS":
        return "B+";
      case "B":
        return "B0";
      default:
        return gradeStatus;
    }
  };

  // 저장 버튼 관련
  const handleSave = async () => {
    // 모든 새 과목명 입력되었는지 확인
    const isValid = newCourseList.every(
      (course) =>
        course.courseName?.trim() !== "" &&
        course.department?.trim() !== "" &&
        course.grade?.trim() !== ""
    );

    const isValidMethods = newPreferMethodList.every(
      (method) =>
        method.menteePreferredTeachingMethod?.trim() !== "" ||
        method.menteePreferredTeaching?.trim() !== ""
    );

    const filteredCourseList = newCourseList.filter(
      (course) =>
        course.courseName?.trim() !== "" &&
        course.grade?.trim() !== "" &&
        course.department?.trim() !== ""
    );

    const filteredMethodList = newPreferMethodList.filter(
      (method) => method.menteePreferredTeaching?.trim() !== ""
    );

    console.log("필터링된 과목 리스트", filteredCourseList);
    console.log("필터링된 수업 방식 리스트", filteredMethodList);

    if (!isValid) {
      alert("이수 교과목 내역을 모두 입력해주세요. ");
      return; //저장 막기
    } else if (!isValidMethods) {
      alert("선호 방식을 모두 입력해주세요!");
      return;
    }

    const convertGradeStatus = (gradeStatus: string) => {
      // gradeStatus가 null인 경우 기본값 설정
      if (!gradeStatus) {
        return ""; // 또는 "DEFAULT"로 설정
      }

      switch (gradeStatus) {
        case "A+":
          return "APLUS";
        case "A0":
          return "A";
        case "B+":
          return "BPLUS";
        case "B0":
          return "B";
        default:
          return gradeStatus;
      }
    };

    // 삭제된 과목을 제외한 새로운 과목 리스트
    const updatedCourseList = [
      ...menteeData.userCourseList
        .filter(
          (course) =>
            !deletedCourseList.some((deleted) => deleted.id === course.id)
        )
        .map((course) => ({
          ...course,
          course: course.courseName,
          grade: course.grade,
        })),
      ...filteredCourseList
        .filter(
          (course) =>
            !menteeData.userCourseList.some(
              (existing) => existing.id === course.id
            )
        )
        .map((course) => ({
          ...course,
          grade: convertGradeStatus(course.grade),
        })),
    ];

    console.log("업데이트된 courseList: ", updatedCourseList);

    // 삭제된 method 제외 새로운 선호 방식 리스트
    const updatedMethodList = [
      ...menteeData.menteePreferredTeachingMethodDtoList
        .filter(
          (method) =>
            !newPreferMethodList.some((deleted) => deleted.id === method.id)
        )
        .map((method) => {
          if (method.menteePreferredTeachingMethod) {
            return {
              ...method,
              menteePreferredTeaching: method.menteePreferredTeachingMethod,
              menteePreferredTeachingMethod: undefined,
            };
          }
        }),
      ...filteredMethodList.filter(
        (method) =>
          method.menteePreferredTeachingMethodDtoList !== null &&
          !menteeData.menteePreferredTeachingMethodDtoList.some(
            (existing) => existing.id === method.id
          )
      ),
    ];

    // 최종 데이터 (selfIntroduction, preferredTeachingMethod 포함)
    const updatePayload = {
      ...menteeData,
      userCourseList: updatedCourseList,
      selfIntroduction: menteeData.selfIntroduction,
      menteePreferredTeachingMethodDtoList: updatedMethodList,
    };

    console.log("업데이트한 정보들: ", updatePayload);

    try {
      const patchResponse = await api.patch(`user/mentee`, updatePayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("patch 응답 데이터:", patchResponse);

      if (patchResponse.status === 200) {
        const updatedMenteeProfile = await fetchMenteeProfile();

        console.log("업데이트된 멘티 데이터", updatedMenteeProfile);
        // 새로 갱신된 데이터를 상태에 반영
        setMenteeData(updatedMenteeProfile);
        setDeletedCourseList([]);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save mentee profile", error);
    }

    // 저장 후 새로운 과목, 수업 방식 리스트 초기화
    setNewCourseList([]);
    setNewPreferMethodList([]);

    setIsEditing(false); // 수정 종료
  };

  // selfIntroduction 수정
  const handleSelfIntroductionChange = (e) => {
    setMenteeData({
      ...menteeData,
      selfIntroduction: e.target.value,
    });
  };

  // 과목 -> + 버튼 클릭 시
  const handleAddCourse = () => {
    setNewCourseList((prevList) => [
      ...prevList,
      {
        id: Date.now(),
        department: "",
        grade: "",
        course: "",
      },
    ]);
    setShowNewCourseList(true);
  };

  // 선호방식 -> + 버튼 클릭 시
  const handleAddPreferMethod = () => {
    setNewPreferMethodList((prevList) => [
      ...prevList,
      { id: Date.now(), menteePreferredTeachingMethod: "" },
    ]);
    setShowNewMethodList(true);
  };

  // 과목 -> - 버튼 클릭 시
  const handleDeleteCourse = (id) => {
    console.log("삭제하려는 id:", id);

    // newCourseList에서 id가 일치하는 항목이 삭제되었는지 확인
    setNewCourseList((prevList) => {
      const updatedList = prevList.filter((course) => {
        return course.id !== id;
      });
      return updatedList;
    });

    // menteeData.userCourseList에서 id가 일치하는 항목이 삭제되었는지 확인
    setMenteeData((prevData) => {
      const updatedCourses = prevData.userCourseList.filter((course) => {
        return course.id !== id;
      });
      return { ...prevData, userCourseList: updatedCourses };
    });
  };

  // 선호과목 -> - 버튼 클릭 시
  const handleDeleteMethod = (id) => {
    setNewPreferMethodList((prevList) => {
      const updatedList = prevList.filter((method) => {
        return method.id !== id;
      });
      return updatedList;
    });

    setMenteeData((prevData) => {
      const updatedMethods =
        prevData.menteePreferredTeachingMethodDtoList.filter((method) => {
          return method.id !== id;
        });
      return {
        ...prevData,
        menteePreferredTeachingMethodDtoList: updatedMethods,
      };
    });
  };

  const handleMethodInputChange = (e, index) => {
    const { value } = e.target;
    const updatedMethods = [...newPreferMethodList];
    updatedMethods[index].menteePreferredTeaching = value;
    setNewPreferMethodList(updatedMethods);
  };

  //역할 전환
  const handleSwitchToMentor = async () => {
    try {
      const response = await api.post(`/user/role`);
      if (response.status === 200) {
        alert("멘토로 전환되었습니다!");
        navigate("/profile/mentor/edit");
      } else {
        alert("멘토 전환에 실패했습니다. 다시 시도해주세요. ");
      }
    } catch (error) {
      console.log("Failed to switch to mentor", error);
      alert("멘토 전환 중 오류가 발생했습니다.");
    }
  };

  const handleDepartmentSelect = (department: string, id: string) => {
    console.log("department ID: ", id);

    // id 기반으로 업데이트
    setNewCourseList((prev) =>
      prev.map((course) =>
        course.id === id
          ? { ...course, department, courseName: "" } // department 변경
          : course
      )
    );
    const newDepartmentCourses = fetchData(department);
    setDepartmentCourse(newDepartmentCourses);

    setSelectedCourse("");
    setSelectedGrade("");
  };

  const handleCourseSelect = (course: string, id: string) => {
    console.log("course ID: ", id);
    console.log("Course selected:", course);
    // setSelectedCourse(course);

    setNewCourseList((prev) =>
      prev.map((courseItem) =>
        courseItem.id === id
          ? { ...courseItem, courseName: course } // courseName 업데이트
          : courseItem
      )
    );
    // setNewCourseList((prev) => [{ ...prev[0], courseName: course }]);
  };

  const handleGradeSelect = (grade: string, id: string) => {
    console.log("grade ID: ", id);
    // setSelectedGrade(grade);

    setNewCourseList((prev) =>
      prev.map((courseItem) =>
        courseItem.id === id
          ? { ...courseItem, grade } // grade 업데이트
          : courseItem
      )
    );
    // setNewCourseList((prev) => [{ ...prev[0], grade: grade }]);
  };

  return (
    <>
      <div className="content-center ">
        <div className="flex justify-between px-10 py-10 pr-11">
          {/* 왼쪽 프로필 */}
          <div className="flex justify-center w-4/12 h-min mt-5 sticky top-[200px]">
            <div className="w-full">
              <div>
                <p className="text-2xl font-bold">Mentee</p>
              </div>
              <div className="flex justify-center">
                <img
                  src={menteeData.menteeImageUrl}
                  className="w-[45%] h-auto aspect-[1/1] rounded-full"
                />
              </div>
              <div className="flex justify-center mt-2">
                <button
                  className="border-2 border-[#D9D9D9] rounded-[20px] px-[27px] py-[6px] text-xl hover:bg-red01 hover:opacity-50 hover:text-white"
                  onClick={handleSwitchToMentor}
                >
                  멘토로 전환
                </button>
              </div>
              <div className="flex justify-center pt-5 pb-2">
                <img src="/mileage.png" alt="씨앗" />
                <h2 className="text-2xl font-bold">
                  {menteeData.menteeNickName}
                </h2>
              </div>
              {/* line */}
              <div className="w-full h-1 bg-black "></div>
              <div className="flex justify-center pt-4">
                {isEditing ? (
                  <textarea
                    value={menteeData.selfIntroduction}
                    onChange={handleSelfIntroductionChange}
                    className="w-full p-3 text-lg rounded-lg border border-gray-300"
                    placeholder="자기소개를 입력하세요..."
                  />
                ) : (
                  <p className="text-xl py-1 px-10">
                    {menteeData.selfIntroduction}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 mt-10 px-10 justify-items-center">
                <button
                  className={`${
                    isEditing
                      ? "bg-lightGray01"
                      : "bg-red01 opacity-50 text-white"
                  } rounded-xl text-lg p-2 w-2/3`}
                  onClick={handleEdit}
                >
                  수정
                </button>
                <button
                  className={`${
                    isEditing
                      ? "bg-red01 opacity-50 text-white"
                      : "bg-lightGray01"
                  } rounded-xl text-lg p-2 w-2/3`}
                  onClick={handleSave}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
          {/* 오른쪽 정보 */}
          <div className="w-7/12 mr-4">
            {/*이수 교과목 내역*/}
            <div className="mb-16">
              <h2 className="text-[22px] font-bold">이수교과목 내역</h2>
              <div className="w-full h-1 bg-black mt-3 mb-3"></div>
              <div className="pl-2">
                {isEditing ? (
                  <div className="grid grid-cols-7 items-center mb-2">
                    <div className="flex justify-start px-5 py-1 ml-2 col-span-2">
                      <p className="content-center text-xl">학과명</p>
                    </div>
                    <div className="flex justify-start px-5 py-1 ml-7 col-span-3">
                      <p className="content-center text-xl">과목명</p>
                    </div>
                    <div className="flex justify-start px-5 py-1 ml-11 col-span-2">
                      <p className="content-center text-xl">성적</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-7 items-center mb-2">
                    <div className="flex justify-start px-5 py-1 ml-2 col-span-2">
                      <p className="content-center text-xl">학과명</p>
                    </div>
                    <div className="flex justify-start px-5 py-1 ml-5 col-span-3">
                      <p className="content-center text-xl">과목명</p>
                    </div>
                    <div className="flex justify-start px-5 py-1 ml-10 col-span-2">
                      <p className="content-center text-xl">성적</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {menteeData.userCourseList &&
                  menteeData.userCourseList.length > 0
                    ? menteeData.userCourseList.map((course) => (
                        <div key={course.id} className="flex items-center">
                          {isEditing ? (
                            <div className="grid grid-cols-7">
                              <input
                                type="text"
                                name="departmentName"
                                disabled
                                value={course.departmentName}
                                className="bg-lightGray02 rounded-[15px] justify-start pl-5 py-2 w-full ml-2 text-lg text-lightGray04 col-span-2"
                              />
                              <input
                                type="text"
                                name="courseName"
                                disabled
                                value={course.courseName}
                                className="bg-lightGray02 rounded-[15px] justify-start pl-5 py-2 w-full ml-7 text-lg text-lightGray04 col-span-3"
                              />
                              <input
                                type="text"
                                name="grade"
                                disabled
                                value={convertGradeSwitch(course.grade)}
                                className="bg-lightGray02 rounded-[15px] py-2 w-[80px] ml-11 text-lg text-lightGray04 col-span-1 flex justify-center text-center"
                              />
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="bg-lightGray01 rounded-full px-2 py-1 ml-10 w-8 h-8 flex items-center justify-center"
                                >
                                  <p className="text-white text-xl font-bold">
                                    -
                                  </p>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-6">
                              <div className="bg-lightGray02 rounded-[15px] justify-start px-5 py-2 w-full ml-2 text-lg col-span-2">
                                {course.departmentName}
                              </div>
                              <div className="bg-lightGray02 rounded-[15px] justify-start pl-5 py-2 w-full ml-6 text-lg col-span-3">
                                {course.courseName}
                              </div>
                              <div className="bg-lightGray02 rounded-[15px] flex justify-center items-center px-4 py-2 ml-10 text-lg w-[80px] col-span-1">
                                {convertGradeSwitch(course.grade)}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    : !isEditing && (
                        <p className="text-gray-500 text-base pl-5 pt-2">
                          현재 등록된 수업이 없습니다.
                        </p>
                      )}

                  {/* 추가 버튼 클릭 시 input */}
                  {isEditing &&
                    showNewCourseList &&
                    newCourseList.map((course, index) => (
                      <div
                        className="grid justify-between items-center grid-cols-7"
                        key={course.id}
                      >
                        <div className="relative col-span-2 ml-2 w-full">
                          <Dropdown
                            selectedOption={course.department}
                            onSelect={(department) =>
                              handleDepartmentSelect(department, course.id)
                            }
                            options={departmentNames || []}
                            placeholder="학과를 선택해주세요."
                          >
                            {({ onSelect }) =>
                              departmentNames.map((name, index) => (
                                <div
                                  key={index}
                                  onClick={() => onSelect(name)}
                                  className="h-8 text-sm py-1 pl-5 cursor-pointer hover:bg-gray-200"
                                >
                                  {name}
                                </div>
                              ))
                            }
                          </Dropdown>
                        </div>
                        <div className="col-span-3 w-full ml-7">
                          <Dropdown
                            selectedOption={course.courseName}
                            onSelect={(courseName) =>
                              handleCourseSelect(courseName, course.id)
                            }
                            options={departmentCourse || []}
                            placeholder="과목을 선택해주세요."
                          >
                            {({ onSelect }) => {
                              if (!Array.isArray(departmentCourse)) return null;
                              (departmentCourse || []).map((name, index) => (
                                <div
                                  key={index}
                                  onClick={() => onSelect(name)}
                                  className="h-8 text-sm py-1 pl-5 cursor-pointer hover:bg-gray-200"
                                >
                                  {name}
                                </div>
                              ));
                            }}
                          </Dropdown>
                        </div>
                        <div className="w-[80px] ml-11 ">
                          <Dropdown
                            selectedOption={course.grade}
                            options={["A+", "A0", "B+", "B0", "C"] || []}
                            onSelect={(grade) =>
                              handleGradeSelect(grade, course.id)
                            }
                            placeholder="성적"
                          ></Dropdown>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="bg-lightGray01 rounded-full px-2 py-1 ml-10 w-8 h-8 flex items-center justify-center"
                          >
                            <p className="text-white text-xl font-bold">-</p>
                          </button>
                        </div>
                      </div>
                    ))}
                  {/* 추가 버튼 */}
                  {isEditing && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleAddCourse}
                        className="bg-lightGray01 rounded-full px-2 py-1 ml-10 w-8 h-8 flex items-center justify-center"
                      >
                        <p className="text-white text-xl font-bold">+</p>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full mb-16">
              <h2 className="text-[22px] font-bold">선호하는 수업 방식</h2>
              <div className="w-full h-1 bg-black mt-[10px] mb-5"></div>
              <div className="pl-[7px] text-xl">
                <div className="flex flex-wrap gap-3 mb-[19px]">
                  {menteeData.menteePreferredTeachingMethodDtoList &&
                  menteeData.menteePreferredTeachingMethodDtoList.length > 0
                    ? menteeData.menteePreferredTeachingMethodDtoList.map(
                        (method) => (
                          <div
                            key={method.id}
                            className="relative bg-lightGray02 rounded-[15px] justify-start px-5 py-2 w-full sm:w-auto"
                          >
                            <p className="content-center text-xl">
                              # {method.menteePreferredTeachingMethod}
                            </p>
                            {/* 마이너스 버튼 */}
                            {isEditing && (
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleDeleteMethod(method.id)}
                                  className="absolute top-[-8px] right-[-5px] bg-lightGray01 rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                                >
                                  <p className="text-white text-xl font-bold">
                                    -
                                  </p>
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      )
                    : !isEditing && (
                        <p className="text-gray-500 text-base pl-5 pt-2">
                          현재 등록된 정보가 없습니다.
                        </p>
                      )}
                </div>
                <div className="grid md:grid-cols-4 sm:grid-cols-2">
                  {/* 추가 버튼 클릭 시 input */}
                  {isEditing &&
                    showNewMethodList &&
                    newPreferMethodList.map((method, index) => (
                      <div
                        className="flex justify-start items-center mb-2 relative"
                        key={method.index}
                      >
                        <input
                          type="text"
                          value={method.menteePreferredTeaching}
                          onChange={(e) => handleMethodInputChange(e, index)}
                          placeholder="수업 방식"
                          className="bg-lightGray02 rounded-[15px] justify-start pl-5 py-2 mr-5 w-full text-lg"
                        />

                        <div className="flex justify-end ">
                          <button
                            onClick={() => handleDeleteMethod(method.id)}
                            className="absolute top-[-8px] right-[15px] bg-lightGray01 rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                          >
                            <p className="text-white text-xl font-bold">-</p>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {/* 추가 버튼 */}
                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddPreferMethod}
                      className="bg-lightGray01 rounded-full px-2 py-1 ml-10 w-8 h-8 flex items-center justify-center"
                    >
                      <p className="text-white text-xl font-bold">+</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditMenteeProfile;
