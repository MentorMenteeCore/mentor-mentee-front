import { format, isToday, parseISO } from "date-fns";

export const MessageList = ({ messages, onSelectMessage }) => {
  return (
    <div className="sm:col-span-2 md:col-span-1 ">
      {/* 메시지 미리보기 */}
      <p className="pb-2 text-2xl">메시지</p>
      <div className="bg-black h-1"></div>
      {/* 메시지들 */}
      <div
        className="bg-lightGray01/50 overflow-hidden h-screen mt-4 cursor-pointer"
        style={{ height: "calc(var(--window-height) - 100px - 10px)" }}
      >
        {messages.chatRooms.map((message) => {
          // lastMessageTime 을 Date 객체로 변환
          let displayTime = "";
          if (message.lastMessageTime) {
            try {
              // lastMessageTime이 있을 때만 처리
              const messageDate = parseISO(message.lastMessageTime);
              const isMessageToday = isToday(messageDate); // 오늘 날짜인지 확인
              displayTime = isMessageToday
                ? format(messageDate, "HH:mm") // 오늘이면 "HH:mm" 형식
                : format(messageDate, "MM-dd"); // 오늘이 아니면 "MM-dd" 형식
            } catch (error) {
              console.error(
                "Invalid date format: ",
                message.lastMessageTime,
                error
              );
            }
          }

          return (
            <div
              className=""
              key={message.roomId}
              onClick={() => onSelectMessage(message.otherUserId)}
            >
              <div className="flex items-center gap-3 px-3 py-3">
                <img
                  src={message.otherUserProfilePicture}
                  className="rounded-full w-[50px] h-[50px]"
                />
                <div className="flex flex-col w-full gap-1">
                  <div className="flex w-full justify-between items-center">
                    <p className="font-bold">{message.otherUserNickname}</p>
                    <p className="text-xs">{displayTime}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs whitespace-nowrap overflow-hidden text-ellipsis w-32">
                      {message.lastMessageContent}
                    </p>
                    <div className="rounded-full bg-red01/50 text-xs w-5 h-5 font-bold text-center text-white">
                      {message.unreadCount}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
