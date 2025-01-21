import { useEffect, useState } from "react";
import api from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { loadDepartments } from "../components/SaveDepartments";
import Dropdown from "../components/Dropdown";
import useWindowHeight from "../components/useWindowHeight";

const EditMentorProfile = () => {
  const [mentorData, setMentorData] = useState({
    courseDetails: [],
    availabilities: [],
    waysOfCommunication: "",
    selfIntroduction: "",
    nickName: "",
    userProfilePictureUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newAvailableList, setNewAvailableList] = useState([]);
  const [newCourseList, setNewCourseList] = useState([]);
  const [deletedCourseList, setDeletedCourseList] = useState([]);
  const [deletedAvailability, setDeletedAvailability] = useState([]);
  const [showNewAvailableTime, setShowNewAvailableTime] = useState(false);
  const [showNewAvailableCourse, setShowNewAvailableCourse] = useState(false);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [departmentCourse, setDepartmentCourse] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
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

  // Mentor Data 불러오기 (페이지 들어올 때마다 실행[location])
  const fetchMentorProfile = async () => {
    try {
      const response = await api.get("/user?page=0&size=100");
      setMentorData(response.data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch mentee profile", error);
      return null;
    }
  };

  useEffect(() => {
    fetchMentorProfile();
  }, [location]);

  useEffect(() => {
    const departments = loadDepartments();
    setDepartmentNames(departments);
  }, []);

  if (!mentorData) {
    return <div>Failed to load profile</div>;
  }

  const dayOfWeekMap = {
    MONDAY: "월요일",
    TUESDAY: "화요일",
    WEDNESDAY: "수요일",
    THURSDAY: "목요일",
    FRIDAY: "금요일",
    SATURDAY: "토요일",
    SUNDAY: "일요일",
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        times.push(formattedTime);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  //역할 전환
  const handleSwitchToMentor = async () => {
    try {
      const response = await api.post(`/user/role`);
      if (response.status === 200) {
        alert("멘티로 전환되었습니다!");
        navigate("/profile/mentee/edit");
      } else {
        alert("멘티 전환에 실패했습니다. 다시 시도해주세요. ");
      }
    } catch (error) {
      console.log("Failed to switch to mentee", error);
      alert("멘티 전환 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const normalizeTime = (time) => {
    // HH:mm:ss 형식이라면, HH:mm 형식으로 변환
    if (time.length === 8) {
      return time.substring(0, 5); // "HH:mm:ss" -> "HH:mm"
    }
    return time; // 이미 "HH:mm" 형식이라면 그대로 반환
  };

  const checkForOverlap = (newDay, existingDays) => {
    console.log("시간 확인", newDay, existingDays);
    if (!newDay.dayOfWeek) return false;

    return existingDays.some((existingDay) => {
      // 요일이 다를 경우 겹침 X -> false
      if (newDay.dayOfWeek !== existingDay.dayOfWeek) {
        return false;
      }

      // 시간을 일관되게 처리
      const normalizedExistingStartTime = normalizeTime(
        existingDay.availableStartTime
      );
      const normalizedExistingEndTime = normalizeTime(
        existingDay.availableEndTime
      );
      const normalizedNewStartTime = normalizeTime(newDay.availableStartTime);
      const normalizedNewEndTime = normalizeTime(newDay.availableEndTime);

      // "1970-01-01T" + time 형태로 Date 객체를 만들어 시간 비교
      const existingStartTime = new Date(
        `1970-01-01T${normalizedExistingStartTime}:00Z`
      );
      const existingEndTime = new Date(
        `1970-01-01T${normalizedExistingEndTime}:00Z`
      );
      const newStartTime = new Date(`1970-01-01T${normalizedNewStartTime}:00Z`);
      const newEndTime = new Date(`1970-01-01T${normalizedNewEndTime}:00Z`);

      // 겹치는 시간대가 있는지 체크
      return newStartTime < existingEndTime && newEndTime > existingStartTime; // 겹침 체크
    });
  };

  const handleSave = async () => {
    // 기존 데이터를 가져옵니다
    const existingAvailabilities = mentorData.availabilities;

    // 입력 시간 유효성 검사 함수
    const isTimeValid = (start, end) => {
      return start < end;
    };

    // "DEFAULT" 값을 가진 항목 필터링
    const filteredAvailableList = newAvailableList.filter(
      (availability) =>
        availability.dayOfWeek.trim() !== "DEFAULT" &&
        availability.availableStartTime.trim() !== "DEFAULT" &&
        availability.availableEndTime.trim() !== "DEFAULT"
    );

    console.log("필터링된 available list:", filteredAvailableList);

    // 새로 추가된 데이터를 필터링하여 겹치는 시간이 있는지 확인합니다.
    const isValidAvailability = filteredAvailableList.every((newDay) => {
      if (checkForOverlap(newDay, existingAvailabilities)) {
        alert("등록하려는 시간대가 기존에 등록된 시간대와 겹칩니다.");
        return false;
      }
      return true;
    });

    if (!isValidAvailability) return;

    // 새로 입력된 데이터를 하나씩 검사
    for (const newAvailability of filteredAvailableList) {
      // 시간 유효성 검사
      if (
        !isTimeValid(
          newAvailability.availableStartTime,
          newAvailability.availableEndTime
        )
      ) {
        console.log(
          "새로운 시작 시간: ",
          newAvailability.availableStartTime,
          "새로운 종료 시간: ",
          newAvailability.availableEndTime
        );
        alert("종료 시간이 시작 시간보다 빠를 수 없습니다.");
        return;
      }
    }

    const filteredCourseList = newCourseList.filter((course) => {
      // course가 유효하지 않으면 undefined를 반환
      return (
        course.courseName.trim() !== "" ||
        course.gradeStatus !== "" ||
        course.courseName !== "" ||
        course.department !== ""
      );
    });

    console.log("필터링된 ", filteredCourseList);

    const isValid = filteredCourseList.every(
      (course) =>
        course.courseName !== "" &&
        course.gradeStatus !== "" &&
        course.department !== ""
    );
    if (!isValid) {
      console.log("새 과목 리스트:", filteredCourseList);
      alert("모든 정보를 입력해주세요.");
      return;
    }

    const formatAvailabilityTimes = (availability) => {
      const formatTime = (time) => {
        if (time === "DEFAULT") {
          return;
        } else if (!time) {
          return "";
        }
        const date = new Date(`1970-01-01T${time}Z`);
        return date.toISOString().substring(11, 19);
      };
      return {
        ...availability,
        dayOfWeek:
          availability.dayOfWeek.trim() === "DEFAULT"
            ? undefined
            : availability.dayOfWeek,
        availableStartTime: formatTime(availability.availableStartTime),
        availableEndTime: formatTime(availability.availableEndTime),
      };
    };

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

    const updatedCourseList = [
      // 기존 mentorData.courseDetails -> 삭제된 수업 삭제
      ...mentorData.courseDetails
        .filter(
          (course) =>
            !deletedCourseList.some((deleted) => deleted.id === course.id)
        )
        // 각 수업 객체를 매핑하여 변환
        .map((course) => ({
          ...course,
          gradeStatus: convertGradeStatus(course.gradeStatus),
        })),
      //새로운 CourseList : 기존의 것에 포함되지 않는 새로운 수업만 필터링
      ...filteredCourseList
        .filter(
          (course) =>
            !mentorData.courseDetails.some(
              (existing) => existing.id === course.id
            )
        )
        // 각 수업 객체 매핑
        .map((course) => ({
          ...course,
          gradeStatus: convertGradeStatus(course.gradeStatus),
        })),
    ];

    console.log("업데이트된 courseList: ", updatedCourseList);

    const updatedAvailability = [
      ...mentorData.availabilities
        .filter(
          (day) => !deletedAvailability.some((deleted) => deleted.id === day.id)
        )
        .map(formatAvailabilityTimes),
      ...filteredAvailableList
        .filter(
          (day) =>
            !mentorData.availabilities.some(
              (existing) => day.id === existing.id
            )
        )
        .map(formatAvailabilityTimes),
    ];

    const updateData = {
      courseDetails: updatedCourseList,
      availabilities: updatedAvailability,
      waysOfCommunication: mentorData.waysOfCommunication,
      selfIntroduction: mentorData.selfIntroduction,
    };

    console.log("업데이트한 정보들: ", updateData);

    try {
      const patchResponse = await api.patch(`mentordetails/update`, updateData);
      console.log("patch 응답 데이터: ", patchResponse);

      if (patchResponse.status === 200) {
        const updatedMentorProfile = await fetchMentorProfile();

        setMentorData(updatedMentorProfile);
        setDeletedCourseList([]);
        setDeletedAvailability([]);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save menotr profile: ", error);
    }
  };

  const handleWeekChange = (e, index) => {
    setNewAvailableList((prevList) => {
      const updatedList = [...prevList]; // 기존 리스트 복사
      updatedList[index] = {
        ...updatedList[index],
        dayOfWeek: e.target.value, // 선택한 요일을 반영
      };
      return updatedList; // 업데이트된 리스트 반환
    });
  };

  const handleAddAvailableTime = () => {
    setNewAvailableList((prevList) => [
      ...prevList,
      {
        id: Date.now(), // 고유한 ID 부여
        dayOfWeek: "DEFAULT",
        availableStartTime: "DEFAULT",
        availableEndTime: "DEFAULT",
      },
    ]);
    setShowNewAvailableTime(true);
  };

  const handleDeleteAvailableTime = (id) => {
    setNewAvailableList((prevList) => {
      const updatedList = prevList.filter((day) => {
        return day.id !== id;
      });
      return updatedList;
    });

    setMentorData((prevData) => {
      const updatedDays = prevData.availabilities.filter((day) => {
        return day.id !== id;
      });
      return { ...prevData, availabilities: updatedDays };
    });
  };

  const handleTimeChange = (e, index, type) => {
    setNewAvailableList((prevList) => {
      const updatedList = [...prevList];
      // 기존 리스트 복사
      if (type === "start") {
        updatedList[index] = {
          ...updatedList[index],
          availableStartTime: e.target.value, // 시작 시간 업데이트
        };
      } else if (type === "end") {
        updatedList[index] = {
          ...updatedList[index],
          availableEndTime: e.target.value, // 종료 시간 업데이트
        };
      }
      return updatedList; // 업데이트된 리스트 반환
    });
  };

  const handleDeleteCourse = (id) => {
    setNewCourseList((prevList) => {
      const updatedList = prevList.filter((course) => {
        return course.id !== id;
      });
      return updatedList;
    });

    setMentorData((prevData) => {
      const updatedCourses = prevData.courseDetails.filter((course) => {
        return course.id !== id;
      });
      return { ...prevData, courseDetails: updatedCourses };
    });
  };

  const handleAddCourse = () => {
    setNewCourseList((prevList) => [
      ...prevList,
      {
        id: Date.now(),
        department: "",
        gradeStatus: "",
        courseName: "",
      },
    ]);
    setShowNewAvailableCourse(true);
  };

  const handleCommunicationChange = (newCommunicationType) => {
    setMentorData((prevState) => ({
      ...prevState,
      waysOfCommunication: newCommunicationType,
    }));
  };

  const handleSelfIntroductionChange = (e) => {
    setMentorData({
      ...mentorData,
      selfIntroduction: e.target.value,
    });
  };

  const handleDepartmentSelect = (department: string, id: string) => {
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
    setNewCourseList((prev) =>
      prev.map((courseItem) =>
        courseItem.id === id
          ? { ...courseItem, courseName: course } // courseName 업데이트
          : courseItem
      )
    );
  };

  const handleGradeSelect = (gradeStatus: string, id: string) => {
    setNewCourseList((prev) =>
      prev.map((courseItem) =>
        courseItem.id === id
          ? { ...courseItem, gradeStatus } // grade 업데이트
          : courseItem
      )
    );
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

  //커스텀 훅 사용
  const windowHeight = useWindowHeight();

  return (
    <>
      <div className="content-center" style={{ height: windowHeight }}>
        <div className="flex justify-between px-10 py-10 pr-11">
          {/* 왼쪽 프로필 */}
          <div className="flex justify-center w-4/12 h-min sticky top-[120px]">
            <div>
              <div>
                <p className="text-2xl font-bold">Mentor</p>
              </div>
              <div className="flex justify-center">
                <img
                  src={mentorData.userProfilePictureUrl}
                  className="w-[45%] h-auto aspect-[1/1] rounded-full"
                />
              </div>
              <div className="flex justify-center mt-2">
                <button
                  className="border-2 border-[#D9D9D9] rounded-[20px] px-[27px] py-[6px] text-xl hover:bg-red01 hover:opacity-50 hover:text-white"
                  onClick={handleSwitchToMentor}
                >
                  멘티로 전환
                </button>
              </div>
              <div className="flex justify-center pt-5 pb-2">
                <img src="/mileage.png" alt="씨앗" />
                <h2 className="text-2xl font-bold">{mentorData.nickName}</h2>
              </div>
              {/* line */}
              <div className="w-full h-1 bg-black "></div>
              <div className="flex justify-center pt-4">
                {isEditing ? (
                  <textarea
                    value={mentorData.selfIntroduction}
                    onChange={handleSelfIntroductionChange}
                    className="w-full p-3 text-lg rounded-lg border border-gray-300"
                    placeholder="자기소개를 입력하세요..."
                  />
                ) : (
                  <p className="text-xl py-1 px-10">
                    {mentorData.selfIntroduction}
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
            {/* 연락 가능 시간 */}
            <section className="mb-16">
              <h2 className="text-[22px] font-bold">연락 가능 시간</h2>
              <div className="w-full h-1 bg-black mt-3 mb-5"></div>
              <div className="pl-4">
                {mentorData.availabilities &&
                mentorData.availabilities.length > 0 ? (
                  !isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
                      {mentorData.availabilities.map((day) => {
                        if (
                          !day.dayOfWeek ||
                          !day.availableStartTime ||
                          !day.availableEndTime
                        ) {
                          return null; // 이 경우 항목을 렌더링하지 않음
                        }

                        return (
                          <div
                            className="bg-lightGray02 rounded-[15px] px-3 py-2 flex gap-3 w-fit"
                            key={day.id}
                          >
                            <div className="text-lg font-semibold">
                              {dayOfWeekMap[day.dayOfWeek]}
                            </div>
                            <div className="text-lg">
                              {day.availableStartTime.substring(0, 5)} ~{" "}
                              {day.availableEndTime.substring(0, 5)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    mentorData.availabilities.map((day) => {
                      if (
                        !day.dayOfWeek ||
                        !day.availableStartTime ||
                        !day.availableEndTime
                      ) {
                        return null; // 이 경우 항목을 렌더링하지 않음
                      }

                      return (
                        <div
                          className="flex justify-start items-center mb-3"
                          key={day.id}
                        >
                          {/* 요일 선택 */}
                          <select
                            value={day.dayOfWeek || ""}
                            disabled
                            className="bg-lightGray02 rounded-[15px] justify-start px-3 py-2 mr-10 text-lg"
                          >
                            <option value="DEFAULT" disabled>
                              요일 선택
                            </option>
                            {Object.entries(dayOfWeekMap).map(
                              ([key, value]) => (
                                <option key={key} value={key}>
                                  {value}
                                </option>
                              )
                            )}
                          </select>

                          {/* 시작 시간 선택 */}
                          <select
                            value={day.availableStartTime.substring(0, 5) || ""}
                            disabled
                            className="bg-lightGray02 rounded-[15px] justify-start px-3 py-2 mr-4 text-lg"
                          >
                            <option value="DEFAULT" disabled>
                              시작 시간
                            </option>
                            {timeOptions.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>

                          <p className="text-xl mr-4">~</p>

                          {/* 종료 시간 선택 */}
                          <select
                            value={day.availableEndTime.substring(0, 5) || ""}
                            disabled
                            className="bg-lightGray02 rounded-[15px] justify-start px-3 py-2 text-lg"
                          >
                            <option value="DEFAULT" disabled>
                              종료 시간
                            </option>
                            {timeOptions.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>

                          {/* 마이너스 버튼 */}
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleDeleteAvailableTime(day.id)}
                              className="bg-lightGray01 rounded-full px-2 py-1 ml-10 w-8 h-8 flex items-center justify-center"
                            >
                              <p className="text-white text-xl font-bold">-</p>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )
                ) : (
                  !isEditing && (
                    <p className="text-gray-500 text-base pl-5">
                      현재 등록된 시간이 없습니다.
                    </p>
                  )
                )}

                {isEditing &&
                  showNewAvailableTime &&
                  newAvailableList.map((day, index) => (
                    <div
                      className="flex justify-start items-center mb-3"
                      key={day.id}
                    >
                      {/* 요일 선택 */}
                      <select
                        value={day.dayOfWeek}
                        onChange={(e) => handleWeekChange(e, index)}
                        className="bg-lightGray02 rounded-[15px] justify-start px-3 py-2 mr-10 text-lg"
                      >
                        <option value="DEFAULT" disabled>
                          요일 선택
                        </option>
                        {Object.entries(dayOfWeekMap).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                      {/* 시작 시간 선택 */}
                      <select
                        value={day.availableStartTime}
                        onChange={(e) => handleTimeChange(e, index, "start")}
                        className="bg-lightGray02 rounded-[15px] justify-start px-3 py-2 mr-4 text-lg"
                      >
                        <option value="DEFAULT" disabled>
                          시작 시간
                        </option>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <p className="text-xl mr-4">~</p>
                      {/* 종료 시간 선택 */}
                      <select
                        value={day.availableEndTime}
                        onChange={(e) => handleTimeChange(e, index, "end")}
                        className="bg-lightGray02 rounded-[15px] justify-start px-3 py-2 text-lg"
                      >
                        <option value="DEFAULT" disabled>
                          종료 시간
                        </option>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      {/* 마이너스 버튼 */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeleteAvailableTime(day.id)}
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
                      onClick={handleAddAvailableTime}
                      className="bg-lightGray01 rounded-full px-2 py-1 ml-10 w-8 h-8 flex items-center justify-center"
                    >
                      <p className="text-white text-xl font-bold">+</p>
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* 수업, 학점 */}
            <section className="mb-16">
              <h2 className="text-[22px] font-bold">수업, 학점</h2>
              <div className="w-full h-1 bg-black mt-[10px] mb-5"></div>
              <div className="pl-2">
                {isEditing ? (
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
                ) : (
                  <div className="grid grid-cols-7 items-center mb-2">
                    <div className="flex justify-start px-5 py-1 col-span-2">
                      <p className="content-center text-xl">학과명</p>
                    </div>
                    <div className="flex justify-start px-5 py-1 col-span-3 ml-6">
                      <p className="content-center text-xl">과목명</p>
                    </div>
                    <div className="flex justify-start px-5 py-1 ml-7 w-full">
                      <p className="content-center text-xl">학점수</p>
                    </div>
                    <div className="flex justify-start px-5 py-1 ml-5">
                      <p className="content-center text-xl">성적</p>
                    </div>
                  </div>
                )}
                {mentorData.courseDetails && mentorData.courseDetails.length > 0
                  ? mentorData.courseDetails.map((course) => (
                      <div key={course.id} className="flex items-center mb-2">
                        {isEditing ? (
                          <div className="grid grid-cols-7">
                            <input
                              type="text"
                              name="departmentName"
                              disabled
                              value={course.department}
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
                              value={convertGradeSwitch(course.gradeStatus)}
                              className="bg-lightGray02 rounded-[15px] justify-start py-2 w-[80px] ml-11 text-lg text-lightGray04 col-span-1 text-center"
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
                          <div className="grid grid-cols-7">
                            <div className="bg-lightGray02 rounded-[15px] justify-start pl-5 py-2 w-full ml-2 text-lg col-span-2">
                              {course.department}
                            </div>
                            <div className="bg-lightGray02 rounded-[15px] justify-start pl-5 py-2 w-full ml-6 text-lg col-span-3">
                              {course.courseName}
                            </div>
                            <div className="bg-lightGray02 rounded-[15px] flex justify-center items-center px-4 py-2 ml-9 text-lg w-[80px]">
                              {course.credit}
                            </div>
                            <div className="bg-lightGray02 rounded-[15px] flex justify-center items-center px-4 py-2 ml-5 text-lg w-[80px]">
                              {course.gradeStatus}
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
                {isEditing &&
                  showNewAvailableCourse &&
                  newCourseList.map((course, index) => (
                    <div
                      className="grid justify-between items-center mb-2 grid-cols-7"
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
                      <div className="w-[80px] ml-11">
                        <Dropdown
                          selectedOption={course.gradeStatus}
                          options={["A+", "A0", "B+", "B0", "C"]}
                          onSelect={(gradeStatus) =>
                            handleGradeSelect(gradeStatus, course.id)
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
            </section>

            {/* 대면/비대면 여부 */}
            <section className="mb-16">
              <h2 className="text-[22px] font-bold">대면/비대면 여부</h2>
              <div className="w-full h-1 bg-black mt-[10px] mb-5"></div>
              <div className="flex pl-5 text-xl">
                <div className="flex mr-[30px]">
                  <div
                    className={`w-[30px] h-[30px] bg-[#D9D9D9] rounded-full mr-5 flex justify-center items-center ${
                      isEditing ? "cursor-pointer" : ""
                    }`}
                    onClick={() =>
                      isEditing &&
                      mentorData.waysOfCommunication !== "FACETOFACE" &&
                      handleCommunicationChange("FACETOFACE")
                    }
                  >
                    {mentorData.waysOfCommunication === "FACETOFACE" ? (
                      <div className="w-[15px] h-[15px] bg-[#FF0000] opacity-50 rounded-full"></div>
                    ) : null}
                  </div>
                  <p>대면</p>
                </div>
                <div className="flex mr-[30px]">
                  <div
                    className={`w-[30px] h-[30px] bg-[#D9D9D9] rounded-full mr-5 flex justify-center items-center ${
                      isEditing ? "cursor-pointer" : ""
                    }`}
                    onClick={() =>
                      isEditing &&
                      mentorData.waysOfCommunication !== "REMOTE" &&
                      handleCommunicationChange("REMOTE")
                    }
                  >
                    {mentorData.waysOfCommunication !== "FACETOFACE" ? (
                      <div className="w-[15px] h-[15px] bg-[#FF0000] opacity-50 rounded-full"></div>
                    ) : null}
                  </div>
                  <p>비대면</p>
                </div>
              </div>
            </section>
            <div className="w-full mb-16">
              <h2 className="text-[22px] font-bold">
                후기 ({mentorData.reviews?.length || 0})
              </h2>
              <div className="w-full h-1 bg-black mt-[10px] mb-5"></div>
              <div>
                {/* 별 간격 고치기 */}
                {mentorData.reviews?.length > 0 ? (
                  mentorData.reviews.map((review, index) => (
                    <div className="mb-[57px]" key={index}>
                      <div className="flex mb-[15px]">
                        <div className="flex w-1/2 justify-around mr-[13px]">
                          {renderStars(review.rate)}
                        </div>
                        <div className="w-0.5 bg-black mr-[5px]"></div>
                        <p className="text-[22px] font-bold">
                          {review.reviewDate?.replace(/-/g, ".")}
                        </p>
                      </div>
                      <p className="text-[22px] font-bold">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews available</p>
                )}
              </div>

              {/* 문의 버튼 */}
              {/* <div className="flex justify-end fixed bottom-16 right-12">
            <button className="h-[61px] bg-[#FF0000] opacity-50 rounded-[10px] text-white text-2xl px-[50px] py-[13px] animate-bounce">
              문의하기
            </button>
          */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditMentorProfile;
