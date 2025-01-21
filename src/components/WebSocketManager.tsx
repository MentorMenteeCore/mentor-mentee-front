import { useEffect, useState } from "react";
import { Stomp } from "@stomp/stompjs";
import api from "../services/api";

// WebSocketManager Component
interface WebSocketManagerProps {
  onConnect: (stompClient: Stomp.Client) => void;
  onDisconnect: () => void;
  currentMessageId: number;
}

const WebSocketManager = ({
  onConnect,
  onDisconnect,
  currentMessageId,
}: WebSocketManagerProps) => {
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);

  const fetchSocketToken = async () => {
    try {
      const { data } = await api.get(`/user/socket-token`);
      localStorage.setItem("socketToken", data.socketToken);
      return data.socketToken;
    } catch (error) {
      console.error("Server Error: ", error);
      return null;
    }
  };

  const initializeWebSocket = async (socketToken: string) => {
    if (socketConnected) return;

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

    socket.onclose = () => {
      console.log("WebSocket 연결 종료됨. ");
      setSocketConnected(false);
      onDisconnect();
    };
  };

  const initializeStomp = (socket: WebSocket, socketToken: string) => {
    console.log("STOMP 연결 시작");

    const stompClient = Stomp.over(() => {
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

    // STOMP 연결
    stompClient.connect(
      { "user-id": userId },
      (frame) => {
        console.log("STOMP 연결 성공:", frame);

        const otherUserId = currentMessageId;

        const [smallUserId, largeUserId] = [
          Math.min(Number(userId), Number(otherUserId)),
          Math.max(Number(userId), Number(otherUserId)),
        ];

        const subscribePath = `/sub/chat/room/${smallUserId}/${largeUserId}`;
        stompClient.subscribe(subscribePath, (message) => {
          console.log("수신된 메시지: ", message.body);
          const receivedMessages = JSON.parse(message.body);
          onConnect(stompClient); // 연결 후, 상위 컴포넌트에 STOMP 클라이언트 전달
        });
      },
      (error) => {
        console.error("STOMP 연결 실패:", error);
        stompClient.deactivate();
      }
    );

    setStompClient(stompClient);
  };

  useEffect(() => {
    (async () => {
      const socketToken = await fetchSocketToken();
      if (socketToken) initializeWebSocket(socketToken);
    })();

    return () => {
      if (stompClient) stompClient.deactivate();
    };
  }, [currentMessageId, stompClient]);

  return null;
};

export default WebSocketManager;
