import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import axios from "axios";

async function getHome(college: string) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_KEY}/college/${college}`
    );
    console.log("getHome function 작동");

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    return [];
  }
}

export default function Home2() {
  const [uni] = useState([
    { collegeName: "인문대학", college: "humanities" },
    { collegeName: "사회과학대학", college: "socialsciences" },
    { collegeName: "자연과학대학", college: "naturescience" },
    { collegeName: "경영대학", college: "business" },
    { collegeName: "공과대학", college: "engineering" },
    { collegeName: "전자정보대학", college: "computerengineering" },
    { collegeName: "농업생명환경대", college: "agriculture" },
    { collegeName: "사범대학", college: "education" },
    { collegeName: "생활과학대학", college: "humanecology" },
    { collegeName: "수의대학", college: "veterinarymedicine" },
    { collegeName: "약학대학", college: "pharmacy" },
    { collegeName: "의과대학", college: "medicine" },
  ]);

  const collegeMap = uni.reduce((map, u) => {
    map[u.collegeName] = u.college;
    return map;
  }, {});

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const departmentName = searchParams.get("departmentName");

  const [posts, setPosts] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(
    departmentName ? collegeMap[departmentName] : "humanities"
  );

  const handleSelect = (e) => {
    setSelectedCollege(e.target.value);
  };

  useEffect(() => {
    async function fetchPosts() {
      let data = await getHome(selectedCollege);
      setPosts(Array.isArray(data) ? data : [data]);
    }
    if (selectedCollege && !departmentName) {
      fetchPosts();
    }
  }, [selectedCollege, departmentName]);

  useEffect(() => {
    console.log("useEffect 실행, departmentName:", departmentName);
    if (departmentName) {
      async function fetchDepartment() {
        try {
          const encodedDepartmentName = encodeURIComponent(departmentName);
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_KEY
            }/search?departmentName=${encodedDepartmentName}`
          );
          let data = await response.data;
          console.log(data);

          if (data) {
            const collegeName = data.collegeName;
            console.log("데이터:", data);
            console.log("collegeName:", collegeName);

            if (collegeName && collegeMap[collegeName]) {
              setSelectedCollege(collegeMap[collegeName]);
              console.log(
                "setSelectedCollege 실행됨:",
                collegeMap[collegeName]
              );
            }

            if (!Array.isArray(data)) {
              data = [data]; // 단일 객체인 경우 배열로 감싸기
            }

            const filteredData = data.filter(
              (department) => department.departmentName === departmentName
            );
            console.log("필터링된 데이터: ", filteredData);
            setPosts(filteredData); // 필터링된 데이터만 상태에 설정
          }
        } catch (error) {
          console.error("Error fetching department data:", error);
          setPosts([]); // 에러 발생 시 빈 배열로 설정
        }
      }
      fetchDepartment();
    } else {
      setPosts([]);
      setSelectedCollege("humanities"); // departmentName 없을 경우 기본값 설정
    }
  }, [departmentName]); // departmentName이 변경될 때만 실행

  useEffect(() => {
    console.log("Updated posts: ", posts);
  }, [posts]);

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
                  src={department.departmentImageUrl}
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
