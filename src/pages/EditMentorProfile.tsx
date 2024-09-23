import { useCallback, useRef } from "react";

const EditMentorProfile = () => {
  return (
    <>
      <div className="content-center">
        <div className="flex justify-between px-10 py-10 pr-11">
          {/*왼쪽 프로필*/}
          <div className="w-4/12 flex justify-center">
            <div className="fixed">
              <p className="text-[28px] pb-2 font-bold">Mentor</p>
              <div className="flex justify-center mb-[10px]">
                <img src="/profile.png" />
              </div>
              <div className="flex justify-center mb-5">
                <button className="border-2 border-[#D9D9D9] rounded-[20px] px-[27px] py-[6px] text-xl">
                  멘티로 전환
                </button>
              </div>
              <p className="text-[22px] mb-6 font-bold">소개글</p>
              <div className="border-2 border-black rounded-[15px] p-5">
                {/*height 자동으로 늘려주는 JavaScript 코드 추가해야함*/}
                <textarea
                  className="text-xl w-full outline-none resize-none row-5 overflow-hidden"
                  value="안녕하세요! 궁금한 거 있으시면 언제든 연락주세요!0!"
                  onInput={handleResizeHeight}
                />
              </div>
            </div>
          </div>
          {/*오른쪽 정보*/}
          <div className="w-7/12 h-full">
            <div className="mb-16">
              <div className="border-2 border-black rounded-[15px]">
                <div className="flex justify-between px-[19px] py-[12px]">
                  <h2 className="text-[22px] font-bold">연락 가능 시간</h2>
                  <button className="text-xl text-[#FF0000] opacity-50 ">
                    수정
                  </button>
                </div>
                <div className="pl-[19px]">
                  <div className="flex mb-[11px]">
                    <div className="bg-[#F5F5F5] rounded-[15px] flex justify-center px-[11px] py-[6px] mr-[21px]">
                      <p className="content-center text-xl">월요일</p>
                    </div>
                    <div className="bg-[#F5F5F5] rounded-[15px] flex justify-center px-[14px] py-[6px]">
                      <p className="content-center text-xl">12:00 ~ 18:00</p>
                    </div>
                  </div>
                  <div className="flex mb-[11px]">
                    <div className="bg-[#F5F5F5] rounded-[15px] flex justify-center px-[11px] py-[6px] mr-[21px]">
                      <p className="content-center text-xl">화요일</p>
                    </div>
                    <div className="bg-[#F5F5F5] rounded-[15px] flex justify-center px-[14px] py-[6px]">
                      <p className="content-center text-xl">16:00 ~ 20:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-2 border-black rounded-[15px] mb-16">
              <div className="w-full">
                <div className="flex justify-between px-[19px] py-[12px]">
                  <h2 className="text-[22px] font-bold">수업, 학점 등록</h2>
                  <button className="text-xl text-[#FF0000] opacity-50 ">
                    수정
                  </button>
                </div>
                <div className="flex justify-center">
                  <div className="w-[90%] text-xl">
                    <div>
                      <div className="flex justify-between mb-[13px]">
                        <div className="w-1/2 pl-4">
                          <p>과목명</p>
                        </div>
                        <div>
                          <p>학점 수</p>
                        </div>
                        <div>
                          <p>전공</p>
                        </div>
                        <div className="flex">
                          <p className="mr-1">성적</p>
                          <img
                            src="/info.png"
                            alt=""
                            className="w-[15px] h-[15px]"
                          />
                        </div>
                      </div>
                      {/* 비율 모르겠슴다 ㅠㅠ*/}
                      <div className="mb-[19px]">
                        <div className="flex justify-between mb-[15px]">
                          <div className="w-1/2 bg-[#F5F5F5] rounded-[15px] py-[6px] px-[17px]">
                            <p>빅데이터시스템</p>
                          </div>
                          <div className="bg-[#F5F5F5] rounded-[15px] flex justify-center py-[6px] px-4">
                            <p>3학점</p>
                          </div>
                          <div className="bg-[#F5F5F5] rounded-[15px] flex justify-center py-[10px] px-4">
                            <img src="/check.png" alt="" />
                          </div>
                          <div className="bg-[#F5F5F5] rounded-[15px] flex justify-center py-[6px] px-4">
                            <p>A+</p>
                          </div>
                        </div>
                        <div className="flex justify-between content-center">
                          <img src="/seed.png" alt="" />
                          <div className="w-full h-[23px] rounded-[15px] bg-[#F5F5F5] mt-1">
                            <div className="w-4/12 h-[23px] rounded-[15px] bg-[#FF0000] opacity-50 flex justify-center items-center text-[15px] text-white">
                              <p>350</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-[19px]">
                        <div className="flex justify-between mb-[15px]">
                          <div className="w-1/2 bg-[#F5F5F5] rounded-[15px] py-[6px] px-[17px]">
                            <p>컴파일러</p>
                          </div>
                          <div className="bg-[#F5F5F5] rounded-[15px] flex justify-center py-[6px] px-4">
                            <p>3학점</p>
                          </div>
                          <div className="bg-[#F5F5F5] rounded-[15px] flex justify-center py-[10px] px-4">
                            <img src="/check.png" alt="" />
                          </div>
                          <div className="bg-[#F5F5F5] rounded-[15px] flex justify-center py-[6px] px-4">
                            <p>A0</p>
                          </div>
                        </div>
                        <div className="flex justify-between content-center">
                          <img src="/seed.png" alt="" />
                          <div className="w-full h-[23px] rounded-[15px] bg-[#F5F5F5] mt-1">
                            <div className="w-9/12 h-[23px] rounded-[15px] bg-[#FF0000] opacity-50 flex justify-center items-center text-[15px] text-white">
                              <p>700</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-2 border-black rounded-[15px] mb-16">
              <div className="w-full px-[19px] py-[12px]">
                <div className="flex justify-between mb-[19px]">
                  <h2 className="text-[22px] font-bold">대면/비대면 설정</h2>
                  <button className="text-xl text-[#FF0000] opacity-50 ">
                    수정
                  </button>
                </div>
                <div className="w-full flex pl-1 text-xl h-[28px] ">
                  <div className="flex mr-[30px]">
                    <div className="w-[30px] h-[30px] bg-[#D9D9D9] rounded-full mr-5 flex justify-center items-center">
                      <div className="w-[15px] h-[15px] bg-[#FF0000] opacity-50 rounded-full"></div>
                    </div>
                    <p>대면</p>
                  </div>
                  <div className="flex mr-[30px]">
                    <div className="w-[30px] h-[30px] bg-[#D9D9D9] rounded-full mr-5 flex justify-center items-center">
                      <div className="w-[15px] h-[15px] bg-[#FF0000] opacity-50 rounded-full"></div>
                    </div>
                    <p>비대면</p>
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

export default EditMentorProfile;
