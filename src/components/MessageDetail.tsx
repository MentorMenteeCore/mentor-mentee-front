import { useEffect, useState } from "react";
import api from "../services/api";
import { format } from "date-fns";

interface MessageDetailProps {
  selectedMessageId: number;
  socket: any;
  onSendMessage: (messageContent: string, roomId: string) => void;
}

export const MessageDetail = ({
  selectedMessageId,
  socket,
  onSendMessage,
}: MessageDetailProps) => {
  const [details, setDetails] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [messageContent, setMessageContent] = useState("");

  // 선택된 채팅방 메시지 불러오기
  const fetchMessages = async () => {
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");
    try {
      const response = await api.get(
        `/message?thisUserId=${userId}&opponentId=${selectedMessageId}`
      );

      const messagesWithValidDates = response.data.chatMessages.map(
        (message) => {
          const receivedTime = new Date(message.time);
          const formattedTime = receivedTime.getTime()
            ? new Date().toISOString()
            : format(receivedTime, "yyyy-MM-dd'T'GG:mm:ss.SSSxxx");
          return {
            ...message,
            time: formattedTime,
          };
        }
      );
      setDetails(messagesWithValidDates);
      setChatRooms(response.data.chatRooms);
    } catch (error) {
      console.error("Error fetching message details:", error);
    }
  };

  useEffect(() => {
    if (selectedMessageId) fetchMessages();
    console.log(details);
  }, [selectedMessageId]);

  //stomp로 받은 메세지 구조 변환
  const transformStompMessageToApiFormat = (receivedMessages, userId) => {
    return {
      content: receivedMessages.message,
      isCurrentUser: receivedMessages.senderId === userId,
      messageId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      readOrNot: !!receivedMessages.otherUserJoined,
      // senderNickname: "",
      senderProfilePicture: receivedMessages.message,
      time: receivedMessages.currentTime,
    };
  };

  // 상대방이 보낸 메세지 실시간 확인
  useEffect(() => {
    if (!socket) return;

    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");

    // stompClient 구독
    const otherUserId = selectedMessageId;

    const [smallUserId, largeUserId] = [
      Math.min(Number(userId), Number(otherUserId)),
      Math.max(Number(userId), Number(otherUserId)),
    ];

    const subscribePath = `/sub/chat/room/${smallUserId}/${largeUserId}`;
    const subscription = socket.subscribe(subscribePath, (message) => {
      console.log("수신된 메시지: ", message.body);
      const receivedMessages = JSON.parse(message.body);
      setDetails((prevMessages) => [
        ...prevMessages,
        transformStompMessageToApiFormat(receivedMessages, userId),
      ]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedMessageId]);

  // 메세지 보내기 및 실시간 확인
  const handleSendMessage = () => {
    if (!messageContent.trim()) return;

    onSendMessage(messageContent, selectedChatRoom.roomId); // 부모에서 전달받은 메시지 전송 함수 호출
    const newMessage = {
      content: messageContent,
      time: new Date().toISOString(),
      isCurrentUser: true,
    };
    setDetails((prevDetails) => [...prevDetails, newMessage]);

    setMessageContent(""); // 메시지 전송 후 입력창 초기화
  };

  // isCurrentUser 가 false인 메시지 찾기
  const otherUserMessage = details.find((message) => !message.isCurrentUser);

  // details가 비어있을 때 chatRooms에서 selectedMessageId와 일치하는 채팅방 찾기
  const selectedChatRoom = chatRooms.find(
    (room) => room.otherUserId === selectedMessageId
  );

  return details?.length > 0 ? (
    <div
      className="border-2 border-black rounded-xl ml-8 mt-9 pt-3 flex flex-col relative"
      style={{ height: "calc(var(--window-height) - 87px)" }}
    >
      {/*헤더*/}
      <div className="flex items-center justify-between px-3">
        {/*앞*/}
        <div className="flex items-center gap-3">
          <img
            src={
              selectedChatRoom?.otherUserProfilePicture ||
              otherUserMessage?.senderProfilePicture
            }
            alt=""
            className="rounded-full h-[50px] w-[50px]"
          />
          <p className="font-bold">
            {otherUserMessage?.senderNickname ||
              selectedChatRoom?.otherUserNickname}
          </p>
          <img src="/handShake.png" alt="" className="mt-2" />
        </div>
        {/*뒤*/}
        <div className="grid grid-cols-3 place-items-center">
          <img src="/warning.png" alt="" />
          <img src="/line.png" alt="" />
          <img src="/exit.png" alt="" />
        </div>
      </div>
      {/*구분선*/}
      <div className="mt-2 border w-full border-black"></div>
      {/*메시지 내용*/}
      <div
        className="flex-1 overflow-y-auto px-3 pt-3"
        style={{ minHeight: 0 }}
      >
        {details?.map((message) => (
          <div className="mb-3">
            <div
              key={message.messageId}
              className={`rounded-lg py-2 px-3 w-fit ${
                message.isCurrentUser
                  ? "bg-red01/50 ml-auto text-right"
                  : "bg-lightGray01/50"
              }`}
            >
              <p>{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.isCurrentUser ? "text-white/70" : "text-black/70"
                }`}
              >
                {new Date(message.time).toLocaleString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* 메시지 입력란 */}
      <div
        className="relative border-t border-black px-2 py-1 w-full left-0 bottom-0"
        style={{ zIndex: 10 }}
      >
        <div className="flex items-center max-w-[calc(100%-16px)] mx-auto ">
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="메시지를 입력하세요."
            className="outline-none flex-grow pl-2"
          />
          <div className="flex items-center gap-2">
            <button onClick={handleSendMessage}>
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
  ) : (
    <div className="p-10 text-lightGray04">
      <p>채팅방을 선택해주세요.</p>
    </div>
  );
};
