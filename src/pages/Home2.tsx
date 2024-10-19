import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

async function getHome(college: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_KEY}/college/${college}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const json = await response.json();

    if (!json || json.length === 0) {
      return [];
    }

    return json;
  } catch (error) {
    console.error("Error fetching home data:", error);
    return [];
  }
}

export default function Home2() {
  const [uni] = useState([
    { collegeName: "인문대학", college: "humanities" },
    { collegeName: "경영대학", college: "business" },
    { collegeName: "교육대학", college: "education" },
  ]);

  const collegeMap = uni.reduce((map, u) => {
    map[u.collegeName] = u.college;
    return map;
  }, {});

  const location = useLocation();
  //search?departmentName=윤리교육과 일 때, ?departmentName=윤리교육과 반환
  const searchParams = new URLSearchParams(location.search);
  const departmentName = searchParams.get("departmentName");
  const [posts, setPosts] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(
    departmentName || "education"
  );

  const handleSelect = (e) => {
    setSelectedCollege(e.target.value);
  };

  // 드롭다운에서 대학 선택 시 데이터 서버에서 가져오고 posts 저장
  useEffect(() => {
    async function fetchPosts() {
      const data = await getHome(selectedCollege);
      setPosts(Array.isArray(data) ? data : [data]);
    }
    if (selectedCollege) {
      fetchPosts();
    }
  }, [selectedCollege]);

  // 학과 검색 시
  useEffect(() => {
    // departmentName이 URL 쿼리 파라미터에 존재할 경우
    if (departmentName) {
      async function fetchDepartment() {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_API_KEY
            }/search?departmentName=${encodeURIComponent(departmentName)}`
          );
          const data = await response.json();

          if (data) {
            setPosts(Array.isArray(data) ? data : [data]);

            const collegeName = data.collegeName;
            if (collegeMap[collegeName]) {
              setSelectedCollege(collegeMap[collegeName]);
            }
          }
        } catch (error) {
          console.error("Error fetching department data:", error);
          setPosts([]);
        }
      }
      fetchDepartment();
    }
  }, [departmentName]);

  return (
    <div className="grid px-5 pt-4">
      <div className="grid">
        <div className="w-fit border-2 rounded-[10px] border-black grid py-1 px-2">
          <select name="학과" onChange={handleSelect} value={selectedCollege}>
            {uni.map((uni) => (
              <option value={uni.college} key={uni.collegeName}>
                {uni.collegeName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-6 pt-5 gap-9">
        {posts.length > 0 ? (
          posts.map((department) => (
            <div className="grid" key={department.departmentId}>
              <Link
                to={`/DepartmentHome/${department.departmentId}`}
                className="bg-lightGray02 grid grid-rows-2 shadow-md shadow-gray02"
              >
                <img
                  src={department.departmentImageUrl || "/im.jpg"}
                  alt={department.departmentName}
                />
                <div></div>
              </Link>
              <Link
                to={`/DepartmentHome/${department.departmentId}`}
                className="justify-self-center py-3 text-[22px]"
              >
                {department.departmentName}
              </Link>
            </div>
          ))
        ) : (
          <div>해당 학과는 찾을 수 없습니다.</div>
        )}
      </div>
    </div>
  );
}
