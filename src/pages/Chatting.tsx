import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { MessageList } from "../components/MessageList";
import { MessageDetail } from "../components/MessageDetail";

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
    chatMessages: [],
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

  // 선택된 채팅방 불러오기
  //   const [selectedMessageId, setSelectedMessageId] = useState(null);
  const handleSendMessage = () => {
    console.log("Send message");
  };
  return (
    <>
      <div
        className="px-8 pt-4 grid grid-cols-5 "
        style={{ height: "var(--window-height)" }}
      >
        {/*메시지 미리보기 부분*/}
        <MessageList
          messages={messages}
          onSelectMessage={handleSelectMessage}
        />
        {/*메시지 자세히보기*/}
        <div className="md:col-span-4 sm:col-span-3 ">
          <MessageDetail selectedMessageId={currentMessageId} />
        </div>
      </div>
    </>
  );
};

export default Chatting;
