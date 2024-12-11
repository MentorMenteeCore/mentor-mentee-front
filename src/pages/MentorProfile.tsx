import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";

const MentorProfile = () => {
  const { nickname } = useParams();
  const [mentorData, setMentorData] = useState({
    mentorId: "",
    courseDetails: [],
    availabilities: [],
    waysOfCommunication: "",
    selfIntroduction: "",
    nickName: "",
    userProfilePictureUrl: "",
    reviews: [],
  });
  const currentUserId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");
  console.log(currentUserId, mentorData.mentorId);

  useEffect(() => {
    const fetchMentorData = async () => {
      const accessToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!accessToken) {
        console.error("Access token is missing");
        return;
      }
      try {
        let response;
        if (nickname) {
          response = await api.get(`/search/user?nickname=${nickname}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        } else {
          response = await api.get(`/mentordetails/update?page=0`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        }
        if (response && response.data) {
          const data = response.data;
          console.log(response);
          setMentorData(data);
        } else {
          console.error("Error fetching mentee data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMentorData();
  }, []);

  if (!mentorData) {
    return <div>Loading... </div>;
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

  const renderStars = (rate) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rate) {
        stars.push(<img src="/star-full.png" alt="Full Start" key={i} />);
      } else {
        stars.push(<img src="/star-empty.png" alt="Empty Star" key={i} />);
      }
    }
    return stars;
  };

  return (
    <div className="content-center">
      <div className="flex justify-between px-10 py-10 pr-11">
        {/* 왼쪽 프로필 */}
        <div className="flex justify-center w-4/12 h-min mt-5 sticky top-[200px]">
          <div>
            <div className="flex justify-center">
              <img
                src={mentorData.userProfilePictureUrl}
                alt="프로필 이미지"
                className="h-[250px] w-[250px] rounded-full"
              />
            </div>
            <p className="text-xl flex justify-center mt-0.5 mb-1">Mentor</p>
            <div className="flex justify-center pt-3 pb-2">
              <img src="/mileage.png" alt="씨앗" />
              <h2 className="text-2xl font-bold">{mentorData.nickName}</h2>
            </div>
            <div className="w-full h-1 bg-black"></div>
            <div className="flex justify-center pt-4">
              <p className="text-xl py-1 px-10">
                {mentorData.selfIntroduction}
              </p>
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
              mentorData.availabilities.length > 0 ? (
                mentorData.availabilities.map((day) => (
                  <div className="flex mb-[11px]" key={day.id}>
                    <div className="bg-[#F5F5F5] rounded-[15px] flex justify-center px-[11px] py-[6px] mr-[21px]">
                      <p className="content-center text-xl">
                        {dayOfWeekMap[day.dayOfWeek]}
                      </p>
                    </div>
                    <div className="bg-[#F5F5F5] rounded-[15px] flex justify-center px-[14px] py-[6px]">
                      <p className="content-center text-xl mr-1">
                        {day.availableStartTime.substring(0, 5)}
                      </p>
                      <p className="content-center text-xl mr-1"> ~ </p>
                      <p className="content-center text-xl">
                        {day.availableEndTime.substring(0, 5)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-base pl-5">
                  현재 등록된 시간이 없습니다.
                </p>
              )}
            </div>
          </section>

          {/* 수업, 학점 */}
          <section className="mb-16">
            <h2 className="text-[22px] font-bold">수업, 학점</h2>
            <div className="w-full h-1 bg-black mt-[10px] mb-5"></div>
            <div className="pl-2">
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
              {mentorData.courseDetails &&
              mentorData.courseDetails.length > 0 ? (
                mentorData.courseDetails.map((course) => (
                  <div key={course.id} className="flex items-center mb-2">
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
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-base pl-5 pt-2">
                  현재 등록된 수업이 없습니다.
                </p>
              )}
            </div>
          </section>

          {/* 대면/비대면 여부 */}
          <section className="mb-16">
            <h2 className="text-[22px] font-bold">대면/비대면 여부</h2>
            <div className="w-full h-1 bg-black mt-[10px] mb-5"></div>
            <div className="flex pl-5 text-xl">
              <div className="flex mr-[30px]">
                <div className="w-[30px] h-[30px] bg-[#D9D9D9] rounded-full mr-5 flex justify-center items-center">
                  {mentorData.waysOfCommunication === "FACETOFACE" && (
                    <div className="w-[15px] h-[15px] bg-[#FF0000] opacity-50 rounded-full"></div>
                  )}
                </div>
                <p>대면</p>
              </div>
              <div className="flex mr-[30px]">
                <div className="w-[30px] h-[30px] bg-[#D9D9D9] rounded-full mr-5 flex justify-center items-center">
                  {mentorData.waysOfCommunication !== "FACETOFACE" && (
                    <div className="w-[15px] h-[15px] bg-[#FF0000] opacity-50 rounded-full"></div>
                  )}
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
                  <div className="mb-10 pl-3" key={index}>
                    <div className="flex mb-4 ">
                      <div className="grid grid-cols-5 gap-2 justify-around mr-5">
                        {renderStars(review.rate)}
                      </div>
                      <div className="w-0.5 bg-black mr-3"></div>
                      <p className="text-lg font-bold">
                        {review.reviewDate?.replace(/-/g, ".")}
                      </p>
                    </div>
                    <p className="text-xl font-bold">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-base pl-5 pt-2">
                  현재 등록된 후기가 없습니다.
                </p>
              )}
            </div>

            {/* 문의 버튼 */}
            {String(currentUserId) !== String(mentorData.mentorId) && (
              <div className="flex justify-end fixed bottom-10 right-12">
                <button className="bg-red01/50 rounded-[12px] text-white text-xl px-7 py-3 ">
                  문의하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
