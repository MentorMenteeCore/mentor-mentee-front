import { useEffect, useState } from "react";
import api from "../services/api";
import { MessageList } from "../components/MessageList";
import { MessageDetail } from "../components/MessageDetail";
import { Stomp } from "@stomp/stompjs";

const Chatting = () => {
  const [currentMessageId, setCurrentMessageId] = useState<number>(0); // currentMessageId 상태 정의 (클릭한 상대방 id)
  const [messages, setMessages] = useState({ chatMessages: [], chatRooms: [] });
  const [userId, setUserId] = useState<number | null>(null);
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);

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
  const fetchSocketToken = async () => {
    try {
      const { data } = await api.get(`/user/socket-token`);
      localStorage.setItem("socketToken", data.socketToken);
      return data.socketToken;
    } catch (error) {
      if (error) {
        console.error("Server Error: ", error);
        return null;
      }
    }
  };

  // WebSocket 연결
  const initializeWebSocket = async (socketToken: string) => {
    const socket = new WebSocket(
      `${import.meta.env.VITE_SOCKET_BASE_URL}/ws-stomp?token=${socketToken}`
    );
    console.log("SockJS 인스턴스 생성됨: ", socket);

    socket.onopen = () => {
      console.log("WebSocket 연결이 열렸습니다.");
      setSocketConnected(true);
      initializeStomp(socket, socketToken);
    };

    socket.onerror = (error) => {
      console.error("WebSocket 연결 오류: ", error);
    };

    socket.onclose = async () => {
      console.log("WebSocket 연결 종료됨. ");
      setSocketConnected(false);
    };
  };

  // STOMP 연결
  const initializeStomp = (socket: WebSocket, socketToken: string) => {
    console.log("stomp 연결 시작");

    const stompClient = Stomp.over(function () {
      return new WebSocket(
        `${import.meta.env.VITE_SOCKET_BASE_URL}/ws-stomp?token=${socketToken}`
      );
    });

    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");

    if (!userId) {
      console.error("User ID가 없습니다.");
      return;
    }

    // WebSocket 연결 상태 확인
    if (socket.readyState !== WebSocket.OPEN) {
      console.error(
        "WebSocket이 열리지 않았습니다. STOMP 연결을 시도할 수 없습니다."
      );
      return;
    }

    // stompClient 연결
    stompClient.connect(
      { "user-id": userId },
      (frame) => {
        console.log("STOMP 연결 성공:", frame);

        // 연결 후 구독 처리
        const otherUserId = currentMessageId;

        const [smallUserId, largeUserId] = [
          Math.min(Number(userId), Number(otherUserId)),
          Math.max(Number(userId), Number(otherUserId)),
        ];

        const subscribePath = `/sub/chat/room/${smallUserId}/${largeUserId}`;
        stompClient.subscribe(subscribePath, (message) => {
          console.log("수신된 메시지: ", message.body);
          const receivedMessages = JSON.parse(message.body);
          setMessages((prevMessages) => ({
            ...prevMessages,
            chatMessages: [...prevMessages.chatMessages, receivedMessages],
          }));
        });
      },
      (error) => {
        console.error("STOMP 연결 실패:", error);
        stompClient.deactivate();
      }
    );

    setStompClient(stompClient);

    socket.onerror = (error) => {
      console.error("stomp - WebSocket 연결 오류: ", error);
      console.log("WebSocket readyState: ", socket.readyState);
    };

    socket.onclose = async () => {
      console.log("stomp - WebSocket 연결 종료됨. ");
      console.log("WebSocket readyState: ", socket.readyState);
      setSocketConnected(false);
    };
  };

  // 메시지 전송 함수
  const handleSendMessage = (messageContent: string, roomId: string) => {
    if (!stompClient) {
      console.error("STOMP 클라이언트가 초기화되지 않았습니다.");
      return;
    }

    if (!messageContent.trim() || currentMessageId === 0) {
      console.error("메시지 내용 또는 현재 메시지 ID가 유효하지 않습니다.", {
        messageContent,
        currentMessageId,
      });
      return;
    }
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");

    const messageData = {
      message: messageContent,
      senderId: userId,
      roomId: roomId,
    };

    try {
      console.log("Sending message", messageData);
      stompClient.send(`/pub/chat/message`, {}, JSON.stringify(messageData));
    } catch (error) {
      console.error("STOMP 메시지 전송 중 오류 발생: ", error);
    }
  };

  // 메시지 목록 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      const userId =
        localStorage.getItem("userId") || sessionStorage.getItem("userId");
      setUserId(Number(userId)); // 유저 ID 설정
      try {
        const { data } = await api.get(`/message?thisUserId=${userId}`);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, []);

  // 순차적으로 token 받아오기, WebSocket 연결, STOMP 연결하기
  useEffect(() => {
    if (!stompClient) {
      (async () => {
        const socketToken = await fetchSocketToken();
        if (socketToken) initializeWebSocket(socketToken);
      })();
    }
  }, [stompClient]);

  return (
    <>
      <div
        className="px-8 pt-4 grid grid-cols-5"
        style={{ height: "var(--window-height)" }}
      >
        <MessageList
          messages={messages}
          onSelectMessage={setCurrentMessageId}
          socket={stompClient}
        />
        <div className="md:col-span-4 sm:col-span-3">
          <MessageDetail
            selectedMessageId={currentMessageId}
            socket={stompClient}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </>
  );
};

export default Chatting;
