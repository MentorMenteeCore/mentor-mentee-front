import { useEffect, useState } from "react";
import api from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

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
  const [newAvailableList, setNewAvailableList] = useState([
    {
      dayOfWeek: "DEFAULT",
      availableStartTime: "DEFAULT",
      availableEndTime: "DEFAULT",
    },
  ]);
  const [newCourseList, setNewCourseList] = useState([
    { courseName: "", credit: "", gradeStatus: "DEFAULT" },
  ]);
  const [deletedCourseList, setDeletedCourseList] = useState([]);
  const [deletedAvailability, setDeletedAvailability] = useState([]);
  const [showNewAvailableTime, setShowNewAvailableTime] = useState(false);
  const [showNewAvailableCourse, setShowNewAvailableCourse] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

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

  const checkForOverlap = (newDay, existingDays) => {
    if (!newDay.dayOfWeek) return false;

    return existingDays.some((existingDay) => {
      if (newDay.dayOfWeek !== existingDay.dayOfWeek) {
        return false;
      }
      const existingStartTime = new Date(
        `1970-01-01T${existingDay.availableStartTime}:00Z`
      );
      const existingEndTime = new Date(
        `1970-01-01T${existingDay.availableEndTime}:00Z`
      );
      const newStartTime = new Date(
        `1970-01-01T${newDay.availableStartTime}:00Z`
      );
      const newEndTime = new Date(`1970-01-01T${newDay.availableEndTime}:00Z`);

      // 겹치는 시간대가 있는지 체크
      return (
        newStartTime < existingEndTime && newEndTime > existingStartTime // 겹침 체크
      );
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
        course.credit !== "" ||
        course.gradeStatus !== "DEFAULT" ||
        course.courseName !== ""
      );
    });

    console.log("필터링된 ", filteredCourseList);

    const isValid = filteredCourseList.every(
      (course) =>
        course.courseName !== "" &&
        course.credit !== 0 &&
        course.gradeStatus !== "DEFAULT"
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
        return date.toISOString();
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

    const convertGradeStatus = (gradeStatus) => {
      // gradeStatus가 null인 경우 기본값 설정
      if (!gradeStatus) {
        return ""; // 또는 "DEFAULT"로 설정
      }

      switch (gradeStatus) {
        case "A+":
          return "APLUS";
        case "B+":
          return "BPLUS";
        default:
          return gradeStatus;
      }
    };

    const updatedCourseList = [
      ...mentorData.courseDetails
        .filter(
          (course) =>
            !deletedCourseList.some((deleted) => deleted.id === course.id)
        )
        .map((course) => ({
          ...course,
          gradeStatus: convertGradeStatus(course.gradeStatus),
          credit: Number(course.credit),
        })),
      ...filteredCourseList
        .filter(
          (course) =>
            !mentorData.courseDetails.some(
              (existing) => existing.id === course.id
            )
        )
        .map((course) => ({
          ...course,
          gradeStatus: convertGradeStatus(course.gradeStatus),
          credit: Number(course.credit),
        })),
    ];

    console.log("업데이트된 courseList: ", updatedCourseList);

    const updatedAvailability = [
      ...mentorData.availabilities.filter(
        (day) => !deletedAvailability.some((deleted) => deleted.id === day.id)
      ),
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
    setShowNewAvailableTime(true);
    // const defaultStartTime = "09:00:00";
    // const defaultEndTime = "18:00:00";
    // setNewAvailableList([
    //   ...newAvailableList,
    //   {
    //     dayOfWeek: "",
    //     availableStartTime: defaultStartTime,
    //     availableEndTime: defaultEndTime,
    //     id: new Date().getTime(),
    //   },
    // ]);
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

  const handleInputCourse = (e, index) => {
    const { name, value } = e.target;
    const updatedCourses = [...newCourseList];
    updatedCourses[index][name] = value;

    setNewCourseList(updatedCourses);
  };

  const handleInputCredit = (e, index) => {
    setNewCourseList((prevList) => {
      const updatedCredit = [...prevList];
      updatedCredit[index] = {
        ...updatedCredit[index],
        credit: e.target.value,
      };
      return updatedCredit;
    });
  };

  const handleInputGrade = (e, index) => {
    setNewCourseList((prevList) => {
      const updatedGrade = [...prevList];
      updatedGrade[index] = {
        ...updatedGrade[index],
        gradeStatus: e.target.value,
      };
      return updatedGrade;
    });
  };

  const handleAddCourse = () => {
    setShowNewAvailableCourse(true);
    // setNewCourseList([
    //   ...newCourseList,
    //   { courseName: "", credit: "", gradeStatus: "", id: new Date().getTime() },
    // ]);
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

  return (
    <>
      <div className="content-center ">
        <div className="flex justify-between px-10 py-10 pr-11">
          {/* 왼쪽 프로필 */}
          <div className="flex justify-center w-4/12 h-min mt-5 sticky top-[200px]">
            <div className="w-full">
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
              <div className="pl-2">
                {mentorData.availabilities &&
                mentorData.availabilities.length > 0
                  ? mentorData.availabilities.map((day) => {
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
                          {isEditing ? (
                            <select
                              value={day.dayOfWeek || ""}
                              onChange={(e) => handleWeekChange(e, day.isValid)}
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
                          ) : (
                            <div className="bg-lightGray02 rounded-[15px] justify-start px-3 py-2 mr-10 text-lg">
                              {dayOfWeekMap[day.dayOfWeek]}
                            </div>
                          )}
                          {/* 시작 시간 선택 */}
                          {isEditing ? (
                            <select
                              value={
                                day.availableStartTime.substring(0, 5) || ""
                              }
                              onChange={(e) =>
                                handleTimeChange(e, day.id, "start")
                              }
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
                          ) : (
                            <div className="bg-lightGray02 rounded-[15px] justify-start px-3 py-2 mr-4 text-lg">
                              {day.availableStartTime.substring(0, 5)}
                            </div>
                          )}
                          <p className="text-xl mr-4">~</p>
                          {/* 종료 시간 선택 */}
                          {isEditing ? (
                            <select
                              value={day.availableEndTime.substring(0, 5) || ""}
                              onChange={(e) =>
                                handleTimeChange(e, day.id, "end")
                              }
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
                          ) : (
                            <div className="bg-lightGray02 rounded-[15px] justify-start px-3 py-2 text-lg">
                              {day.availableEndTime.substring(0, 5)}
                            </div>
                          )}

                          {/* 마이너스 버튼 */}
                          {isEditing && (
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  handleDeleteAvailableTime(day.id)
                                }
                                className="bg-lightGray01 rounded-full px-2 py-1 ml-10 w-8 h-8 flex items-center justify-center"
                              >
                                <p className="text-white text-xl font-bold">
                                  -
                                </p>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  : !isEditing && (
                      <p className="text-gray-500 text-base pl-5">
                        현재 등록된 시간이 없습니다.
                      </p>
                    )}
                {isEditing &&
                  showNewAvailableTime &&
                  newAvailableList.map((day, index) => (
                    <div className="flex justify-start items-center mb-3">
                      <select
                        value={day.dayOfWeek || ""}
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
                      {/*시작 시간 선택*/}
                      <select
                        value={day.availableStartTime || ""}
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
                      {/*종료 시간 선택*/}
                      <select
                        value={day.availableEndTime || ""}
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
                <div className="flex items-center mb-2">
                  <div className="flex justify-start px-5 py-1 w-1/2 ml-2">
                    <p className="content-center text-xl">과목명</p>
                  </div>
                  <div className="flex justify-start px-5 py-1 ml-7">
                    <p className="content-center text-xl">학점 수</p>
                  </div>
                  <div className="flex justify-start px-5 py-1 ml-5">
                    <p className="content-center text-xl">성적</p>
                  </div>
                </div>
                {mentorData.courseDetails && mentorData.courseDetails.length > 0
                  ? mentorData.courseDetails.map((course) => (
                      <div key={course.id} className="flex items-center mb-2">
                        {/* 과목명 */}
                        {isEditing ? (
                          <input
                            type="text"
                            name="courseName"
                            disabled
                            value={course.courseName}
                            onChange={(e) => handleInputCourse(e, course.id)}
                            placeholder="새 과목명"
                            className="bg-lightGray02 rounded-[15px] justify-start pl-5 py-2 w-1/2 ml-2 text-lg text-lightGray04"
                          />
                        ) : (
                          <div className="bg-lightGray02 rounded-[15px] justify-start pl-5 py-2 w-1/2 ml-2 text-lg">
                            {course.courseName}
                          </div>
                        )}

                        {/* 학점 */}
                        {isEditing ? (
                          <select
                            value={course.credit}
                            onChange={(e) => handleInputCredit(e, course.id)}
                            disabled
                            className="bg-lightGray02 rounded-[15px] justify-start pl-8 py-2 ml-10 text-lg w-[80px]"
                          >
                            <option value="DEFAULT">학점 수</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select>
                        ) : (
                          <div className="bg-lightGray02 rounded-[15px] flex justify-center items-center px-4 py-2 ml-10 text-lg w-[80px]">
                            {course.credit}
                          </div>
                        )}

                        {/* 성적 */}
                        {isEditing ? (
                          <select
                            value={course.gradeStatus || ""}
                            onChange={(e) => handleInputGrade(e, course.id)}
                            disabled
                            className="bg-lightGray02 rounded-[15px] flex justify-center items-center pl-5 py-2 ml-10 text-lg w-[80px]"
                          >
                            <option value="DEFAULT" disabled>
                              성적
                            </option>
                            <option value="APLUS">A+</option>
                            <option value="A">A0</option>
                            <option value="BPLUS">B+</option>
                            <option value="B">B0</option>
                            <option value="C">C</option>
                          </select>
                        ) : (
                          <div className="bg-lightGray02 rounded-[15px] flex justify-center items-center px-4 py-2 ml-10 text-lg w-[80px]">
                            {course.gradeStatus}
                          </div>
                        )}
                        {/* 마이너스 버튼 */}
                        {isEditing && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="bg-lightGray01 rounded-full px-2 py-1 ml-10 w-8 h-8 flex items-center justify-center"
                            >
                              <p className="text-white text-xl font-bold">-</p>
                            </button>
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
                    <div className="flex justify-start items-center mb-2">
                      <input
                        type="text"
                        name="courseName"
                        value={course.courseName}
                        onChange={(e) => handleInputCourse(e, index)}
                        placeholder="새 과목명"
                        className="bg-lightGray02 rounded-[15px] justify-start pl-5 py-2 w-1/2 ml-2 text-lg"
                      />
                      <select
                        value={course.credit}
                        onChange={(e) => handleInputCredit(e, index)}
                        className="bg-lightGray02 rounded-[15px] justify-start  pl-7 py-2 ml-10 text-lg w-[80px]"
                      >
                        <option value="DEFAULT">수</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                      <select
                        value={course.gradeStatus || ""}
                        onChange={(e) => handleInputGrade(e, index)}
                        className="bg-lightGray02 rounded-[15px] justify-start pl-3 py-2 ml-10 text-lg w-[80px]"
                      >
                        <option value="DEFAULT" disabled>
                          성적
                        </option>
                        <option value="APLUS">A+</option>
                        <option value="A">A0</option>
                        <option value="BPLUS">B+</option>
                        <option value="B">B0</option>
                        {/* <option value="CPLUS">C+</option> */}
                        <option value="C">C</option>
                        {/* <option value="DPLUS">D+</option>
                        <option value="D">D0</option> */}
                        {/* <option value="F">F</option> */}
                      </select>
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
