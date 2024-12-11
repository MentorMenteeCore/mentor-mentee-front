import { useEffect, useState } from "react";
import api from "../services/api";

export const MessageDetail = ({ selectedMessageId }) => {
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (!selectedMessageId) return;

    const fetchDetails = async () => {
      const userId =
        localStorage.getItem("userId") || sessionStorage.getItem("userId");
      try {
        const response = await api.get(
          `/message?thisUserId=${userId}&opponentId=${selectedMessageId}`
        );
        console.log(response.data);
        setDetails(response.data.chatMessages);
      } catch (error) {
        console.error("Error fetching message details:", error);
      }
    };

    fetchDetails();
  }, [selectedMessageId]);

  if (!details.length) return <p>대화를 선택하세요.</p>;

  // isCurrentUser 가 false인 메시지 찾기
  const otherUserMessage = details.find((message) => !message.isCurrentUser);

  return (
    <div
      className="border-2 border-black  ml-8 mt-9 py-3 flex flex-col h-full"
      style={{ height: "calc(var(--window-height) - 87px)" }}
    >
      <div>
        {/*헤더*/}
        <div className="flex items-center justify-between px-3">
          {/*앞*/}
          <div className="grid grid-cols-3 items-center gap-1 place-items-center">
            <img
              src={otherUserMessage.senderProfilePicture}
              alt=""
              className="rounded-full"
            />
            <p>{otherUserMessage.senderNickname}</p>
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
          {details.map((message) => (
            <div>
              <div
                key={message.messageId}
                className={`rounded-lg py-2 px-3 w-fit ${
                  message.isCurrentUser
                    ? "bg-red01/50 ml-auto text-right"
                    : "bg-lightGray01/50"
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
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
  );
};
