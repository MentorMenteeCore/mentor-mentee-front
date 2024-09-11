import { useState } from "react";
import { Link } from "react-router-dom";

const SignupAgree = () => {
  function handleClick(event) {
    event.preventDefault();

    const requiredCheckboxes = document.querySelectorAll(
      'input[name="Agree"][required]'
    );
    const checkedRequired = document.querySelectorAll(
      'input[name="Agree"][required]:checked'
    );

    // 필수 체크박스 중 체크되지 않은 항목이 있을 경우 폼 제출을 막음
    if (checkedRequired.length !== requiredCheckboxes.length) {
      alert("모든 필수 항목에 동의해야 합니다.");
      event.preventDefault(); // 폼 제출 막기
      return;
    } else {
      window.location.href = "/join/roleSelect";
    }
  }

  function checkSelectAll() {
    const checkboxes = document.querySelectorAll('input[name="Agree"]');
    const checked = document.querySelectorAll('input[name="Agree"]:checked');
    const selectAll = document.querySelector('input[name="selectall"]');

    if (checkboxes.length === checked.length) {
      selectAll.checked = true;
    } else {
      selectAll.checked = false;
    }
  }

  function selectAll(e) {
    const checkboxes = document.getElementsByName("Agree");

    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });
  }
  return (
    <>
      <div className="pt-3">
        <div className="grid place-content-center gap-4">
          <div className="flex justify-center">
            <Link to={"/"} className="text-3xl">
              LOGO
            </Link>
          </div>
          <form onSubmit={handleClick} className="bg-lightGray04 p-3">
            <div className="border-2 border-white text-white">
              <h2 className="text-3xl ml-4 pt-3 pb-3">약관동의</h2>
              <form className="px-6">
                <div className="mb-4">
                  <input
                    type="checkbox"
                    name="selectall"
                    id="all-check"
                    onChange={selectAll}
                    className="w-[20px] h-[20px] rounded-[5px]border-2 border-white bg-[#6E6E6E]"
                  ></input>
                  {/*Document.querySelectorAll() */}
                  <label htmlFor="all-check" className="ml-[13px] text-[20px]">
                    아래 약관에 모두 동의합니다.
                  </label>
                </div>
                <div className="mb-4">
                  <input
                    type="checkbox"
                    name="Agree"
                    id="service-check"
                    onClick={checkSelectAll}
                    required={true}
                    className="w-[20px] h-[20px] rounded-[5px]border-2 border-white"
                  ></input>
                  <label
                    htmlFor="service-check"
                    className="ml-[13px] text-[20px] opacity-80"
                  >
                    서비스 이용약관 동의 (필수)
                  </label>
                </div>
                <div className="mb-4">
                  <input
                    type="checkbox"
                    name="Agree"
                    id="personalInfo-check"
                    onClick={checkSelectAll}
                    required={true}
                    className="w-[20px] h-[20px] rounded-[5px]border-2 border-white"
                  ></input>
                  <label
                    htmlFor="personalInfo-check"
                    className="ml-[13px] text-[20px] opacity-80"
                  >
                    개인정보 수집 및 이용 동의 (필수)
                  </label>
                </div>
                <div className="mb-4">
                  <input
                    type="checkbox"
                    name="Agree"
                    id="comunity-check"
                    onClick={checkSelectAll}
                    required={true}
                    className="w-[20px] h-[20px] rounded-[5px]border-2 border-white"
                  ></input>
                  <label
                    htmlFor="comunity-check"
                    className="ml-[13px] text-[20px] opacity-80"
                  >
                    커뮤니티 이용규칙 확인 (필수)
                  </label>
                </div>
                <div className="mb-4">
                  <input
                    type="checkbox"
                    name="Agree"
                    id="eventAlarm-check"
                    onClick={checkSelectAll}
                    className="w-[20px] h-[20px] rounded-[5px] border-2 border-white"
                  ></input>
                  <label
                    htmlFor="eventAlarm-check"
                    className="ml-[13px] text-[20px] opacity-80"
                  >
                    광고성 정보 수신 동의 (선택)
                  </label>
                  <div className="mt-1 p-2 border-[1px] border-white rounded-[10px] text-base">
                    다양한 맞춤형 광고성 정보가 발송 됩니다.
                  </div>
                </div>
                <div className="mb-4">
                  <input
                    type="checkbox"
                    name="Agree"
                    id="verification-check"
                    onClick={checkSelectAll}
                    required={true}
                    className="w-[20px] h-[20px] rounded-[5px] border-2 border-white"
                  ></input>
                  <label
                    htmlFor="verification-check"
                    className="ml-[13px] text-[20px] opacity-80"
                  >
                    본인 명의를 이용하여 가입 진행 동의 (필수)
                  </label>
                  <div className="mt-1 p-2 border-[1px] border-white rounded-[10px] text-base">
                    부모님, 친구 등 타인의 명의로 가입을 진행할 수 없습니다.
                  </div>
                </div>
                <div className="mb-4">
                  <input
                    type="checkbox"
                    name="Agree"
                    id="age-check"
                    onClick={checkSelectAll}
                    required={true}
                    className="w-[20px] h-[20px] rounded-[5px] border-2 border-white"
                  ></input>
                  <label
                    htmlFor="age-check"
                    className="ml-[13px] text-[20px] opacity-80"
                  >
                    만 14세 이상 확인 (필수)
                  </label>
                  <div className="mt-1 mb-[20px] p-2 border-[1px] border-white rounded-[10px] text-base">
                    <p>LOGO는 충북대학교 대학생을 위한 서비스이며,</p>
                    <p>본인 인증을 통해 만 14세 이상만 가입할 수 있습니다.</p>
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={handleClick}
                  className="border-[1px] bg-white border-[#F5F5F5] rounded-[10px] text-black text-[16px] w-full p-1 mb-4"
                >
                  확인
                </button>
              </form>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupAgree;
