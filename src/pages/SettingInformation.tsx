import { useEffect, useState } from "react";
import api from "../services/api";

const SettingInformation = () => {
  const [userInfo, setUserInfo] = useState({});

  const [isEditable, setIsEditable] = useState({
    userNickname: true,
    userDepartment: true,
    yearInUni: true,
  });

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
  }, []);

  const handleChange = (e, field) => {
    setUserInfo((prev) => {
      const updatedUserInfo = { ...prev, [field]: e.target.value };
      console.log("Updated User Info:", updatedUserInfo); // 값 확인
      return updatedUserInfo;
    });
  };

  const handleEdit = async (field) => {
    if (isEditable[field]) {
      setIsEditable((prevState) => ({
        ...prevState,
        [field]: false,
      }));
    } else {
      const updatedField = { [field]: userInfo[field] };
      console.log("Updating field:", updatedField);

      const updateField = async () => {
        try {
          const accessToken =
            localStorage.getItem("token") || sessionStorage.getItem("token");
          if (!accessToken) {
            console.error("Access token is missing");
            return;
          }
          const response = await api.patch(`/user/information`, updatedField, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          console.log(response.data);

          setIsEditable((prevState) => ({
            ...prevState,
            [field]: true,
          }));
        } catch (error) {
          console.log("Failed to update user information", error);
        }
      };
      updateField();
    }
  };

  useEffect(() => {
    console.log(isEditable.userNickname);
  }, []);

  return (
    <>
      <div>
        <p className="text-2xl pb-2">내 정보</p>
        <div className="border-2 border-black grid grid-cols-4 p-4">
          <div className="">
            <div className="flex justify-center py-3">
              <img src={userInfo.userImageUrl || "/profile.png"} alt="사진" />
            </div>
            <div className="flex justify-center">
              <button className="text-xl border-2 border-black p-2 rounded-[10px]">
                프로필 변경
              </button>
            </div>
          </div>

          <div className="col-span-3 grid gap-3 px-11">
            <div className="pt-7">
              <div className="flex justify-between items-center text-xl pb-3">
                <p className="text-slate-600">닉네임</p>
                <button
                  className="text-blue01"
                  onClick={() => handleEdit("userNickname")}
                >
                  {isEditable.userNickname ? "수정" : "저장"}
                </button>
              </div>
              <div
                className={`border-2 border-black rounded-[15px] px-5 py-2 text-2xl bg-lightGray02 ${
                  !isEditable.userNickname ? "bg-white" : ""
                }`}
              >
                <input
                  type="text"
                  value={userInfo.userNickname}
                  readOnly={isEditable.userNickname}
                  onChange={(e) => handleChange(e, "userNickname")}
                  className={`bg-lightGray02 text-slate-600 outline-none ${
                    !isEditable.userNickname ? "bg-white" : ""
                  }`}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center text-xl pb-3">
                <p className="text-slate-600">이메일</p>
              </div>
              <div className="border-2 border-black rounded-[15px] px-5 py-2 text-2xl bg-lightGray02">
                <input
                  type="text"
                  defaultValue={userInfo.userEmail}
                  readOnly
                  className="bg-lightGray02 text-slate-600 outline-none w-full"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center text-xl pb-3">
                <p className="text-slate-600">학과</p>
                <button
                  className="text-blue01"
                  onClick={() => handleEdit("userDepartment")}
                >
                  {isEditable.userDepartment ? "수정" : "저장"}
                </button>
              </div>
              <div
                className={`border-2 border-black rounded-[15px] px-5 py-2 text-2xl bg-lightGray02 ${
                  !isEditable.userDepartment ? "bg-white" : ""
                }`}
              >
                <input
                  type="text"
                  value={userInfo.userDepartment || ""}
                  readOnly={isEditable.userDepartment}
                  onChange={(e) => handleChange(e, "userDepartment")}
                  className={`bg-lightGray02 text-slate-600 outline-none ${
                    !isEditable.userDepartment ? "bg-white" : ""
                  }`}
                />
              </div>
            </div>
            <div className="pb-7">
              <div className="flex justify-between items-center text-xl pb-3">
                <p className="text-slate-600">학년</p>
                <button
                  className="text-blue01"
                  onClick={() => handleEdit("yearInUni")}
                >
                  {isEditable.yearInUni ? "수정" : "저장"}
                </button>
              </div>
              <div
                className={`border-2 border-black rounded-[15px] px-5 py-2 text-2xl bg-lightGray02 ${
                  !isEditable.yearInUni ? "bg-white" : ""
                }`}
              >
                <select
                  value={userInfo.yearInUni}
                  onChange={(e) => handleChange(e, "yearInUni")}
                  disabled={isEditable.yearInUni}
                  className={`bg-lightGray02 text-slate-600 outline-none w-full pr-10 ${
                    !isEditable.yearInUni ? "bg-white" : ""
                  }`}
                >
                  <option value="DEFAULT" disabled>
                    학년 선택
                  </option>
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                  <option value="4">4학년</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingInformation;
