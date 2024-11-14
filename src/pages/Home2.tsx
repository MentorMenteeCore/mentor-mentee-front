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
  const searchParams = new URLSearchParams(location.search);
  const departmentName = searchParams.get("departmentName");

  const [posts, setPosts] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(
    departmentName ? collegeMap[departmentName] : "humanities"
  );

  const navigate = useNavigate();

  const handleSelect = (e) => {
    console.log("handleSelect 작동 중 : ", posts);
    setPosts([]);
    setSelectedCollege(e.target.value);
    searchParams.delete("departmentName");
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  useEffect(() => {
    async function fetchPosts() {
      let data = await getHome(selectedCollege);
      setPosts(Array.isArray(data) ? data : [data]);
    }

    if (departmentName) {
      // departmentName이 있을 경우 학과 데이터 가져오기
      async function fetchDepartment() {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_KEY
            }/search?departmentName=${encodeURIComponent(departmentName)}`
          );
          const data = response.data || [];
          setPosts(Array.isArray(data) ? data : [data]);
          const collegeName = data.collegeName;
          if (collegeName && collegeMap[collegeName]) {
            setSelectedCollege(collegeMap[collegeName]);
          }
        } catch (error) {
          console.error("Error fetching department data:", error);
          setPosts([]);
        }
      }
      fetchDepartment();
    } else {
      fetchPosts(); // departmentName이 없으면 selectedCollege에 맞는 학과 데이터 가져오기
    }
  }, [selectedCollege, departmentName]);

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
