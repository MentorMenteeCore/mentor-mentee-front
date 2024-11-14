const MenteeProfile = () => {
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
              <p className="text-xl flex justify-center mt-0.5">Mentee</p>
              <div className="flex justify-center pt-[5px] pb-2">
                <img src="/mileage.png" alt="씨앗" />
                <h2 className="text-2xl font-bold">박아무개2</h2>
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
              <h2 className="text-[22px] font-bold">이수교과목 내역</h2>
              <div className="w-full h-1 bg-black mt-3 mb-3"></div>
              <div className="pl-2">
                <div className="grid grid-cols-2 mb-2">
                  <div className="flex justify-start px-5 py-1 mr-[21px]">
                    <p className=" content-center text-xl">과목명</p>
                  </div>
                  <div className="flex justify-start px-5 py-1">
                    <p className="content-center text-xl">전공</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 mb-3">
                  <div className="bg-[#F5F5F5] rounded-[15px] justify-start pl-5 py-2 mr-10">
                    <p className="content-center text-xl">이산수학</p>
                  </div>
                  <div className="bg-[#F5F5F5] rounded-[15px] justify-start content-center w-[60px] px-5 py-2 ml-3">
                    <img
                      className="content-center"
                      src="/check.png"
                      alt="check"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 mb-3">
                  <div className="bg-[#F5F5F5] rounded-[15px] justify-start pl-5 py-2 mr-10">
                    <p className="content-center text-xl">선형대수학</p>
                  </div>
                  <div className="bg-[#F5F5F5] rounded-[15px] justify-start px-5 py-2 w-[60px] ml-3">
                    <img
                      className="content-center"
                      src="/check.png"
                      alt="check"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mb-16">
              <h2 className="text-[22px] font-bold">선호하는 수업 방식</h2>
              <div className="w-full h-1 bg-black mt-[10px] mb-5"></div>
              <div className="pl-[7px] text-xl">
                <div className="flex flex-wrap gap-3 mb-[19px]">
                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="bg-[#F5F5F5] rounded-[15px] justify-start px-5 py-2 w-full sm:w-auto">
                      <p className="content-center text-xl"># PDF 자료</p>
                    </div>
                    <div className="bg-[#F5F5F5] rounded-[15px] justify-start px-5 py-2 w-full sm:w-auto">
                      <p className="content-center text-xl"># PPT 자료</p>
                    </div>
                    <div className="bg-[#F5F5F5] rounded-[15px] justify-start px-5 py-2 w-full sm:w-auto">
                      <p className="content-center text-xl"># PPT 자료</p>
                    </div>
                    <div className="bg-[#F5F5F5] rounded-[15px] justify-start px-5 py-2 w-full sm:w-auto">
                      <p className="content-center text-xl"># PPT 자료</p>
                    </div>
                    <div className="bg-[#F5F5F5] rounded-[15px] justify-start px-5 py-2 w-full sm:w-auto">
                      <p className="content-center text-xl"># PPT 자료</p>
                    </div>
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
