import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

async function getHome(college: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_KEY}/college/${college}`
  );
  const json = await response.json();
  return json;
}

// 인문대학 [] 이런 식이 아니라 {college} 안에 그냥 넣어주면 따라락 나옴
export default function Home2() {
  const [uni] = useState([
    {
      collegeName: "인문대학",
      college: "humanities",
    },
    {
      collegeName: "경영대학",
      college: "business",
    },
    {
      collegeName: "사범대학",
      college: "education",
    },
  ]);

  const [selectedCollege, setSelectedCollege] = useState("humanities");
  const [posts, setPosts] = useState([]);

  const handleSelect = (e) => {
    setSelectedCollege(e.target.value);
  };

  useEffect(() => {
    async function fetchPosts() {
      const data = await getHome(selectedCollege);
      setPosts(data);
    }
    if (selectedCollege) {
      fetchPosts();
    }
  }, [selectedCollege]);

  return (
    <>
      <div className="grid px-5">
        <div className="grid">
          <div className="w-fit border-2 rounded-[10px] border-black grid py-1 px-2">
            <select name="학과" onChange={handleSelect} value={selectedCollege}>
              {uni.map((uni) => (
                <option value={uni.college} key={uni.college}>
                  {uni.collegeName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-6 pt-5 gap-9">
          {posts.map((department) => (
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
          ))}
        </div>
      </div>
    </>
  );
}
