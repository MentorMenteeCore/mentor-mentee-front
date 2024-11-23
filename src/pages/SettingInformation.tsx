import { useEffect, useState } from "react";
import api from "../services/api";

const SettingInformation = () => {
  const [userInfo, setUserInfo] = useState({
    userNickname: "",
    userEmail: "",
    userDepartment: "",
    yearInUni: "",
    userImageUrl: "",
  });

  const [isEditable, setIsEditable] = useState({
    userNickname: true,
    userDepartment: true,
    yearInUni: true,
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected File:", file);
    } else {
      console.error("No file selected");
    }
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("프로필 사진을 선택해주세요.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("파일 크기가 10MB를 초과합니다. 더 작은 파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    const json = { userNickname: userInfo.userNickname };
    formData.append(
      "userInfo",
      new Blob([JSON.stringify(json)], { type: "application/json" })
    );

    try {
      const accessToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!accessToken) {
        console.error("Access token is missing");
        return;
      }

      const response = await api.patch(`user/profile/image`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile updated: ", response.data);
      alert("프로필 사진이 성공적으로 변경되었습니다.");

      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        userImageUrl: response.data.userImageUrl, // 서버에서 받은 새로운 이미지 URL
      }));
    } catch (error) {
      if (error.response) {
        // 서버에서 반환한 응답이 있을 경우
        console.error("Server Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else {
        // 네트워크 오류 등 클라이언트에서 발생한 에러
        console.error("Request Error:", error.message);
      }
      alert("프로필 사진 변경에 실패했습니다.");
    }
  };

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
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
      }
    };
    fetchUserInfo();
  }, [userInfo.userImageUrl]);

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
          alert("학과명을 정확하게 입력해주세요.");
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
              <img
                className="rounded-full w-[180px] h-[180px]"
                src={userInfo.userImageUrl}
                alt="사진"
                key={userInfo.userImageUrl}
              />
            </div>
            <div className="flex justify-center items-center gap-2">
              <div className="flex flex-col items-center gap-2">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-black text-lg font-semibold py-2 px-4 rounded-md shadow-md transition-all"
                >
                  Upload Image
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {selectedFile && (
                <div className="flex justify-center">
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    className={`className="cursor-pointeropacity-50 text-black text-lg  py-2   px-4 rounded-md shadow-md transition-all" ${
                      selectedFile ? " text-black" : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    업로드
                  </button>
                </div>
              )}
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
                  value={userInfo.yearInUni || "DEFAULT"}
                  onChange={(e) => handleChange(e, "yearInUni")}
                  disabled={isEditable.yearInUni}
                  className={`bg-lightGray02 outline-none w-full pr-10 ${
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
