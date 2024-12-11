import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { MessageList } from "../components/MessageList";

const Chatting = () => {
  // 화면 길이 자동 계산
  const setRootHeight = () => {
    const root = document.documentElement;
    root.style.setProperty("--window-height", `${window.innerHeight - 100}px`);
  };
  useEffect(() => {
    setRootHeight();
    window.addEventListener("resize", setRootHeight);
    return () => window.removeEventListener("resize", setRootHeight);
  }, []);
  // webSocket token 얻어오기
  useEffect(() => {
    const fetchSocketToken = async () => {
      try {
        const response = await api.get(`/user/socket-token`);
        console.log(response.data);
        const { socketToken } = response.data;
        localStorage.setItem("socketToken", socketToken);
      } catch (error) {
        if (error.response) {
          console.error("Server Error: ", error.response.data);
        } else {
          console.error("Request Error: ", error.message);
        }
      }
    };
    fetchSocketToken(); //비동기 함수 호출
  }, []);
  // webSocket 연결
  const socketRef = useRef(null);
  useEffect(() => {
    const socketToken = localStorage.getItem("socketToken");
    const socket = new WebSocket(
      `${import.meta.env.VITE_SOCKET_BASE_URL}/ws-stomp?token=${socketToken}`
    );
    socketRef.current = socket;
    socket.onopen = () => {
      console.log("WebSocket 연결이 열렸습니다.");
    };
    socket.onmessage = (message) => {
      console.log("message: ", message.data);
    };
    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };
    socket.onclose = () => {
      console.log("WebSoket close");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  // message 연결
  const [messages, setMessages] = useState({
    chatMessages: "",
    chatRooms: [],
  });
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const handleSelectMessage = (id) => setCurrentMessageId(id);

  useEffect(() => {
    const fetchMessages = async () => {
      const userId =
        localStorage.getItem("userId") || sessionStorage.getItem("userId");
      try {
        const response = await api.get(`/message?thisUserId=${userId}`);
        console.log("Messages fetched: ", response.data);
        setMessages(response.data);
      } catch (error) {
        if (error.response) {
          console.error("Server Error: ", error.response.data);
        }
      }
    };
    fetchMessages();
  }, []);
  const handleSendMessage = () => {
    console.log("Send message");
  };
  return (
    <>
      <div
        className="px-8 pt-4 grid grid-cols-5"
        style={{ height: "var(--window-height)" }}
      >
        {/*메시지 미리보기 부분*/}
        <MessageList
          messages={messages}
          onSelectMessage={handleSelectMessage}
        />
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
