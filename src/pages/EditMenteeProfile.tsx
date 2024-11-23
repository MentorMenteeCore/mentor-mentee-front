import { useEffect, useState } from "react";
import api from "../services/api";
import { useLocation } from "react-router-dom";

const EditMenteeProfile = () => {
  const [menteeData, setMenteeData] = useState({
    menteeImageUrl: "",
    selfIntroduction: "",
    userCourseList: [],
    menteePreferredTeachingMethodDtoList: [],
    menteeNickName: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newCourseList, setNewCourseList] = useState([
    { courseName: "", isMajor: "" },
  ]);
  const [newPreferMethodList, setNewPreferMethodList] = useState([
    { menteePreferredTeachingMethod: "" },
  ]);
  const [deletedCourseList, setDeletedCourseList] = useState([]);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const location = useLocation();

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

  if (!menteeData) {
    return <div>Failed to load profile</div>;
  }

  // 수정 버튼 클릭 시 수정 가능하게 변경
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 저장 버튼 관련
  const handleSave = async () => {
    // 모든 새 과목명 입력되었는지 확인
    const isValid = newCourseList.every(
      (course) => course.courseName.trim() !== ""
    );

    const isValidMethods = newPreferMethodList.every(
      (method) => method.menteePreferredTeachingMethod.trim() !== ""
    );

    if (!isValid) {
      alert("새 과목명을 입력해주세요!");
      return; //저장 막기
    } else if (!isValidMethods) {
      alert("선호 방식을 입력해주세요!");
      return;
    }

    // 삭제된 과목을 제외한 새로운 과목 리스트
    const updatedCourseList = [
      ...menteeData.userCourseList.filter(
        (course) =>
          !deletedCourseList.some((deleted) => deleted.id === course.id)
      ),
      ...newCourseList.filter(
        (course) =>
          !menteeData.userCourseList.some(
            (existing) => existing.id === course.id
          )
      ),
    ];

    const updatedMethodList = [
      ...menteeData.menteePreferredTeachingMethodDtoList.filter(
        (method) =>
          !newPreferMethodList.some((newMethod) => newMethod.id === method.id)
      ),
      ...newPreferMethodList,
    ];

    // 최종 데이터 (selfIntroduction, preferredTeachingMethod 포함)
    const updatePayload = {
      ...menteeData,
      userCourseList: updatedCourseList,
      selfIntroduction: menteeData.selfIntroduction,
      menteePreferredTeachingMethodDtoList: updatedMethodList,
    };

    console.log("업데이트 포함된 정보들: ", updatePayload);

    try {
      const patchResponse = await api.patch(`user/mentee`, updatePayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("patchResponse data:", patchResponse);

      if (patchResponse.status === 200) {
        const updatedMenteeProfile = await fetchMenteeProfile();

        console.log("Updated mentee profile:", updatedMenteeProfile);
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
    setNewCourseList([
      ...newCourseList,
      { courseName: "", isMajor: "NOTMAJOR", id: new Date().getTime() },
    ]);
    setIsAddingCourse(true);
  };

  // 선호방식 -> + 버튼 클릭 시
  const handleAddPreferMethod = () => {
    setNewPreferMethodList([
      ...newPreferMethodList,
      { menteePreferredTeachingMethod: "" },
    ]);
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

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCourses = [...newCourseList];
    updatedCourses[index][name] = value; // 입력 값 업데이트

    if (name === "courseName" && value.trim() === "") {
      updatedCourses[index].isMajor = "NOTMAJOR";
    }

    setNewCourseList(updatedCourses);
  };

  const handleMethodInputChange = (e, index) => {
    const { value } = e.target;
    const updatedMethods = [...newPreferMethodList];
    updatedMethods[index].menteePreferredTeachingMethod = value;
    setNewPreferMethodList(updatedMethods);
  };

  const handleMajorToggle = (index) => {
    const updatedCourses = [...newCourseList];
    updatedCourses[index].isMajor =
      updatedCourses[index].isMajor === "MAJOR" ? "NOTMAJOR" : "MAJOR"; // 전공 토글
    setNewCourseList(updatedCourses);
  };

  return (
    <>
      <div className="content-center ">
        <div className="flex justify-between px-10 py-10 pr-11">
          {/* 왼쪽 프로필 */}
          <div className="flex justify-center w-4/12 h-min mt-5 sticky top-[200px]">
            <div className="w-full">
              <div className="flex justify-center">
                <img
                  src={menteeData.menteeImageUrl}
                  className="w-[45%] h-auto aspect-[1/1] rounded-full"
                />
              </div>
              <div className="flex justify-center mt-2">
                <button className="border-2 border-[#D9D9D9] rounded-[20px] px-[27px] py-[6px] text-xl">
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
                <div className="flex items-center mb-2">
                  <div className="flex justify-start px-5 py-1 mr-[21px] w-1/2 ">
                    <p className="content-center text-xl">과목명</p>
                  </div>
                  <div className="flex justify-start px-5 py-1 ml-4">
                    <p className="content-center text-xl">전공</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {menteeData.userCourseList &&
                  menteeData.userCourseList.length > 0
                    ? menteeData.userCourseList.map((course) => (
                        <div className="flex items-center mb-2">
                          {/* 과목명 */}
                          <div className="bg-lightGray02 rounded-[15px] justify-start pl-5 py-2 mr-10 w-1/2">
                            <p className="content-center text-xl">
                              {course.courseName}
                            </p>
                          </div>
                          {/* 체크 표시 */}
                          <div className="bg-lightGray02 rounded-[15px] justify-start px-5 py-2 w-[60px] ml-3">
                            {course.isMajor === "MAJOR" ? (
                              <img
                                className="content-center "
                                src="/check.png"
                                alt="check"
                              />
                            ) : (
                              <img
                                className="content-center invisible"
                                src="/check.png"
                                alt="check"
                              />
                            )}
                          </div>
                          {/* 마이너스 버튼 */}
                          {isEditing && (
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
                          )}
                        </div>
                      ))
                    : !isEditing && (
                        <p className="pt-10 pl-5">이수 교과목이 없습니다.</p>
                      )}

                  {/* 추가 버튼 클릭 시 input */}
                  {isEditing &&
                    newCourseList.map((course, index) => (
                      <div className="flex justify-start items-center mb-2">
                        <input
                          type="text"
                          name="courseName"
                          value={course.courseName}
                          onChange={(e) => handleInputChange(e, index)}
                          placeholder="새 과목명"
                          className="bg-lightGray02 rounded-[15px] justify-start pl-5 py-2 mr-10 w-1/2 text-lg"
                        />
                        <div
                          className="bg-lightGray02 rounded-[15px] justify-start px-5 py-2 w-[60px] ml-3 cursor-pointer"
                          onClick={() => handleMajorToggle(index)}
                          // onClick={() =>
                          //   setNewCourse((prev) => ({
                          //     ...prev,
                          //     isMajor: prev.isMajor === "MAJOR" ? "" : "MAJOR",
                          //   }))
                          // }
                        >
                          {course.isMajor === "MAJOR" ? (
                            <img
                              className="content-center "
                              src="/check.png"
                              alt="check"
                            />
                          ) : (
                            <img
                              className="content-center invisible"
                              src="/check.png"
                              alt="check"
                            />
                          )}
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
                        <p className="pt-10 pl-5">
                          선호하는 수업 방식이 없습니다.
                        </p>
                      )}
                </div>
                {/* 추가 버튼 클릭 시 input */}
                {isEditing &&
                  newPreferMethodList.map((method, index) => (
                    <div
                      className="flex justify-start items-center mb-2"
                      key={index}
                    >
                      <input
                        type="text"
                        value={method.menteePreferredTeachingMethod}
                        onChange={(e) => handleMethodInputChange(e, index)}
                        placeholder="수업 방식"
                        className="bg-lightGray02 rounded-[15px] justify-start pl-5 py-2 mr-10 w-1/3 text-lg"
                      />

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeleteMethod(method.id)}
                          className="bg-lightGray01 rounded-full px-2 py-1 w-8 h-8 flex items-center justify-center"
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
