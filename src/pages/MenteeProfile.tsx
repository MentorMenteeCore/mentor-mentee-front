import { useEffect, useState } from "react";
import api from "../services/api";

const MenteeProfile = () => {
  const [menteeData, setMenteeData] = useState({
    menteeImageUrl: "",
    selfIntroduction: "",
    userCourseList: [],
    menteePreferredTeachingMethodDtoList: [],
  });

  useEffect(() => {
    const fetchMenteeData = async () => {
      const accessToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!accessToken) {
        console.error("Access token is missing");
        return;
      }
      try {
        const response = await api.get(`/user?page=0&size=100`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response) {
          const data = response.data;
          console.log(response);
          setMenteeData(data);
        } else {
          console.error("Error fetching mentee data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMenteeData();
  }, []);

  if (!menteeData) {
    return <div>Loading... </div>;
  }

  return (
    <>
      <div className="content-center ">
        <div className="flex justify-between px-10 py-10 pr-11">
          {/*왼쪽 프로필*/}
          <div className="flex justify-center w-4/12 h-min mt-5 sticky top-[200px]">
            <div className="w-full">
              <div className="flex justify-center">
                <img
                  src={menteeData.menteeImageUrl}
                  className="w-[45%] h-auto aspect-[1/1] rounded-full"
                />
              </div>

              <p className="text-xl flex justify-center mt-0.5 mb-1">Mentee</p>
              <div className="flex justify-center pt-3 pb-2">
                <img src="/mileage.png" alt="씨앗" />
                <h2 className="text-2xl font-bold">
                  {menteeData.menteeNickName}
                </h2>
              </div>
              {/*line*/}
              <div className="w-full h-1 bg-black "></div>
              <div className="flex justify-center pt-4">
                <p className="text-xl py-1 px-10">
                  {menteeData.selfIntroduction}
                </p>
              </div>
            </div>
          </div>
          {/*오른쪽 정보*/}
          <div className="w-7/12 mr-4">
            <div className="mb-16">
              <h2 className="text-[22px] font-bold">이수교과목 내역</h2>
              <div className="w-full h-1 bg-black mt-3 mb-3"></div>
              <div className="pl-2">
                <div className="flex items-center mb-2">
                  <div className="flex justify-start px-5 py-1 mr-[21px] w-1/2 ">
                    <p className=" content-center text-xl">과목명</p>
                  </div>
                  <div className="flex justify-start px-5 py-1 ml-4">
                    <p className="content-center text-xl">전공</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {Array.isArray(menteeData.userCourseList) &&
                  menteeData.userCourseList.length > 0 ? (
                    menteeData.userCourseList.map((course) => (
                      <div key={course.id} className="flex items-center mb-2">
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
                              className="content-center"
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
                      </div>
                    ))
                  ) : (
                    <div>No courses available</div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full mb-16">
              <h2 className="text-[22px] font-bold">선호하는 수업 방식</h2>
              <div className="w-full h-1 bg-black mt-[10px] mb-5"></div>
              <div className="pl-[7px] text-xl">
                <div className="flex flex-wrap gap-3 mb-[19px]">
                  <div className="flex flex-wrap gap-3 mb-3">
                    {Array.isArray(
                      menteeData.menteePreferredTeachingMethodDtoList
                    ) &&
                    menteeData.menteePreferredTeachingMethodDtoList.length >
                      0 ? (
                      menteeData.menteePreferredTeachingMethodDtoList.map(
                        (method) => (
                          <div
                            className="bg-[#F5F5F5] rounded-[15px] justify-start px-5 py-2 w-full sm:w-auto"
                            key={method.id}
                          >
                            <p className="content-center text-xl">
                              # {method.menteePreferredTeachingMethod}
                            </p>{" "}
                            {/* 직접 문자열을 렌더링 */}
                          </div>
                        )
                      )
                    ) : (
                      <div>No preferred teaching methods available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenteeProfile;
