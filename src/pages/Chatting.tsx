import { useEffect } from "react";

const Chatting = () => {
  const setRootHeight = () => {
    const root = document.documentElement;
    root.style.setProperty("--window-height", `${window.innerHeight - 100}px`);
  };

  useEffect(() => {
    setRootHeight();
    window.addEventListener("resize", setRootHeight);
    return () => window.removeEventListener("resize", setRootHeight);
  }, []);

  return (
    <>
      <div
        className="px-8 pt-4 grid grid-cols-5"
        style={{ height: "var(--window-height)" }}
      >
        {/*메시지 미리보기*/}
        <div className="sm:col-span-2 md:col-span-1">
          <p className="pb-2 text-2xl">메시지</p>
          <div className="bg-black h-1"></div>
          {/* 메시지들 */}
          <div
            className="bg-lightGray01/50 overflow-hidden h-screen mt-4"
            style={{ height: "calc(var(--window-height) - 100px - 10px)" }}
          >
            <div className="flex gap-3 px-3 py-3 items-center">
              <img
                src="/profile.png"
                className="rounded-full w-[50px] h-[50px]"
              />
              <div>
                <p className="font-bold">박아무개</p>
                <p className="text-sm">네 다음번 수업 에에</p>
              </div>
            </div>
          </div>
        </div>

        {/*메시지 자세히보기*/}
        <div
          className="border-2 border-black md:col-span-4 sm:col-span-3 ml-8 mt-9 py-3 flex flex-col h-full"
          style={{ height: "calc(var(--window-height) - 87px)" }}
        >
          {/*헤더*/}
          <div className="flex items-center justify-between px-3">
            {/*앞*/}
            <div className="grid grid-cols-3 items-center gap-1 place-items-center">
              <img src="" alt="" className="rounded-full" />
              <p>박아무개</p>
              <img src="/handShake.png" alt="" />
            </div>
            {/*뒤*/}
            <div className="grid grid-cols-3 place-items-center">
              <img src="/warning.png" alt="" />
              <img src="/line.png" alt="" />
              <img src="/exit.png" alt="" />
            </div>
          </div>
          {/*선*/}
          <div className="mt-3 border w-full border-black"></div>
          {/*내용*/}
          <div className="flex-1 flex flex-col overflow-y-auto px-3 pt-3 gap-3">
            <div className="bg-lightGray01/50 rounded-lg py-2 px-3 w-fit">
              ㅎㅎ
            </div>
            <div className="bg-red01/50 rounded-lg py-2 px-3 ml-auto text-right w-fit ">
              ㅎㅎ
            </div>
            {/* 메시지 입력란 */}
            <div className="flex border border-black rounded-md p-1 mt-auto">
              <input
                type="text"
                placeholder="메시지를 입력하세요."
                className="outline-none w-full pl-2"
              />
              <div className="grid grid-cols-3 place-items-center items-center">
                <button>
                  <img src="/send.png" alt="" />
                </button>
                <img src="/line.png" alt="" />
                <button>
                  <img src="/file.png" alt="" className="h-8 mt-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatting;
