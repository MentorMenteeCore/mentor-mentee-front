import { useEffect, useState } from "react";

const SettingInformation = () => {
  const [userInfo, setUserInfo] = useState({
    userNickname: "골목대장퉁퉁이",
    userEmail: "streetKingTungTung2@naver.com",
    userDepartment: "경영학과",
    yearInUni: 2,
    userImageUrl: "",
  });

  const [isEditable, setIsEditable] = useState({
    nickname: true,
    department: true,
    year: true,
  });

  const handleEdit = (nickname, department, year) => {
    setIsEditable((prevState) => ({
      ...prevState,
      nickname: nickname,
      department: department,
      year: year,
    }));
  };

  const handleChange = (e, field) => {
    setUserInfo((prev) => ({ ...prev, [field]: e.target.value }));
  };

  useEffect(() => {
    console.log(isEditable.nickname);
  }, []);

  return (
    <>
      <div>
        <p className="text-2xl pb-2">내 정보</p>
        <div className="border-2 border-black grid grid-cols-4 p-4">
          <div className="">
            <div className="flex justify-center py-3">
              <img src="/profile.png" alt="사진" />
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
                  onClick={() => {
                    setIsEditable((prevState) => ({
                      ...prevState,
                      nickname: !prevState.nickname,
                    }));
                    if (isEditable.nickname === false) {
                      // put 요청
                    }
                  }}
                >
                  {isEditable.nickname ? "수정" : "저장"}
                </button>
              </div>
              <div className="border-2 border-black rounded-[15px] px-5 py-2 text-2xl bg-lightGray02">
                <input
                  type="text"
                  value={userInfo.userNickname}
                  readOnly={isEditable.nickname ? true : false}
                  onChange={(e) => handleChange(e, "userNickname")}
                  className="bg-lightGray02 text-slate-600 outline-none"
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
                  className="bg-lightGray02 text-slate-600 outline-none"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center text-xl pb-3">
                <p className="text-slate-600">학과</p>
                <button
                  className="text-blue01"
                  onClick={() => {
                    setIsEditable((prevState) => ({
                      ...prevState,
                      department: !prevState.department,
                    }));
                    if (isEditable.department === false) {
                      // put 요청
                    }
                  }}
                >
                  {isEditable.department ? "수정" : "저장"}
                </button>
              </div>
              <div className="border-2 border-black rounded-[15px] px-5 py-2 text-2xl bg-lightGray02">
                <input
                  type="text"
                  defaultValue={userInfo.userDepartment}
                  readOnly={isEditable.department ? true : false}
                  onChange={(e) => handleChange(e, "userDepartment")}
                  className="bg-lightGray02 text-slate-600 outline-none"
                />
              </div>
            </div>
            <div className="pb-7">
              <div className="flex justify-between items-center text-xl pb-3">
                <p className="text-slate-600">학년</p>
                <button className="text-blue01">수정</button>
              </div>
              <div className="border-2 border-black rounded-[15px] px-5 py-2 text-2xl bg-lightGray02">
                <input
                  type="text"
                  defaultValue={userInfo.yearInUni}
                  readOnly
                  className="bg-lightGray02 text-slate-600 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingInformation;
