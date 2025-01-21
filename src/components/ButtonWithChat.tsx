import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const ButtonWithChat = ({ currentUserId, mentorId }) => {
  const navigate = useNavigate();

  const handleChat = async () => {
    try {
      const response = await api.post(`/room`, {
        userID: currentUserId,
        otherID: mentorId,
      });

      if (response.data.code === 200) {
        navigate(`/chat`);
      } else {
        alert("채팅방을 생성할 수 없습니다.");
      }
    } catch (error) {
      console.error("Error creating chat room: ", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex justify-end fixed bottom-10 right-12">
      <button
        className="bg-red01/50 rounded-[12px] text-white text-xl px-7 py-3 "
        onClick={handleChat}
      >
        문의하기
      </button>
    </div>
  );
};
