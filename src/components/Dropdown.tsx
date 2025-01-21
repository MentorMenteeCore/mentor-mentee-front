import { useEffect, useRef, useState } from "react";

const Dropdown = ({
  selectedOption,
  onSelect,
  options = [],
  placeholder = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  // 드롭다운 외부 클릭을 감지하여 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // 드롭다운 외부 클릭 시 닫기
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClickOutside);

    // 정리 함수: 이벤트 리스너 해제
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* 선택된 항목 */}
      <div
        onClick={toggleDropdown}
        className="bg-lightGray02 rounded-[15px] pl-5 py-2 text-lg cursor-pointer"
      >
        {selectedOption || placeholder}
      </div>

      {/* 드롭다운 목록 */}
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-[15px] shadow-lg max-h-[12.5rem] overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className="h-8 text-sm py-1 pl-5 cursor-pointer hover:bg-gray-200"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
