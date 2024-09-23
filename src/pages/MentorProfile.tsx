const MentorProfile = () => {
  return (
    <>
      <div className="content-center ">
        <div className="flex justify-between px-10 py-10 pr-11">
          {/*왼쪽 프로필*/}
          <div className="flex justify-center w-4/12">
            <div className="fixed">
              <div className="flex justify-center">
                <img src="/profile.png" />
              </div>
              <p className="text-xl flex justify-center mt-0.5">Mentor</p>
              <div className="flex justify-center pt-[5px] pb-2">
                <img src="/mileage.png" alt="씨앗" />
                <h2 className="text-2xl font-bold">박아무개1</h2>
              </div>
              {/*line*/}
              <div className="w-full h-1 bg-black "></div>
              <div className="flex justify-center pt-[14px]">
                <p className="text-xl">
                  안녕하세요! <br /> 궁금한 거 있으시면 언제든 <br /> 연락주세요
                  !0!
                </p>
              </div>
            </div>
          </div>
          {/*오른쪽 정보*/}
          <div className="w-7/12 mr-4">
            <div className="mb-16">
              <h2 className="text-[22px] font-bold">연락 가능 시간</h2>
              <div className="w-full h-1 bg-black mt-[10px] mb-5"></div>
              <div className="pl-[7px]">
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
            <div className="w-full mb-16">
              <h2 className="text-[22px] font-bold">수업, 학점</h2>
              <div className="w-full h-1 bg-black mt-[10px] mb-5"></div>
              <div className="w-[90%] pl-[7px] text-xl">
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
                    <div>
                      <p className="">성적</p>
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
            <div className="w-full mb-16">
              <h2 className="text-[22px] font-bold">대면/비대면 여부</h2>
              <div className="w-full h-1 bg-black mt-[10px] mb-5"></div>
              <div className="w-full flex pl-5 text-xl h-[28px] ">
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
            <div className="w-full mb-16">
              <h2 className="text-[22px] font-bold">후기 (3) </h2>
              <div className="w-full h-1 bg-black mt-[10px] mb-5"></div>
              <div>
                {/* 별 간격 고치기 */}
                <div className="mb-[57px]">
                  <div className="flex mb-[15px]">
                    <div className="flex w-1/2 justify-around mr-[13px]">
                      <img src="/star-full.png" alt="" />
                      <img src="/star-full.png" alt="" />
                      <img src="/star-empty.png" alt="" />
                      <img src="/star-empty.png" alt="" />
                      <img src="/star-empty.png" alt="" />
                    </div>
                    <div className="w-0.5 bg-black mr-[5px]"></div>
                    <p className="text-[22px] font-bold">24.06.30</p>
                  </div>
                  <p className="text-[22px] font-bold">
                    원하는 방향대로 수업을 진행해주셨지만 시간을 어기는 경우가
                    가끔 있으셨어요
                  </p>
                </div>
                <div className="mb-[57px]">
                  <div className="flex mb-[15px]">
                    <div className="flex w-1/2 justify-around mr-[13px]">
                      <img src="/star-full.png" alt="" />
                      <img src="/star-full.png" alt="" />
                      <img src="/star-full.png" alt="" />
                      <img src="/star-full.png" alt="" />
                      <img src="/star-full.png" alt="" />
                    </div>
                    <div className="w-0.5 bg-black mr-[5px]"></div>
                    <p className="text-[22px] font-bold">24.06.29</p>
                  </div>
                  <p className="text-[22px] font-bold">
                    항상 좋은 자료를 준비해주시고 수업도 열정적으로 해주셔서
                    감사합니다
                  </p>
                </div>
                <div className="mb-[57px]">
                  <div className="flex mb-[15px]">
                    <div className="flex w-1/2 justify-around mr-[13px]">
                      <img src="/star-full.png" alt="" />
                      <img src="/star-full.png" alt="" />
                      <img src="/star-full.png" alt="" />
                      <img src="/star-empty.png" alt="" />
                      <img src="/star-empty.png" alt="" />
                    </div>
                    <div className="w-0.5 bg-black mr-[5px]"></div>
                    <p className="text-[22px] font-bold">24.06.28</p>
                  </div>
                  <p className="text-[22px] font-bold">
                    생각했던 것보다 성적이 잘 안 나왔어요
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end fixed bottom-16 right-12">
              <button className="h-[61px] bg-[#FF0000] opacity-50 rounded-[10px] text-white text-2xl px-[50px] py-[13px] animate-bounce">
                문의하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorProfile;
