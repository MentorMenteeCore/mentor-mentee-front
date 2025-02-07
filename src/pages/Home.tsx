import { useState } from "react";
import { Link } from "react-router-dom";

// 인문대학 [] 이런 식이 아니라 {college} 안에 그냥 넣어주면 따라락 나옴
const Home = () => {
  const [posts, getPosts] = useState({
    인문대학: [
      {
        departmentId: 1,
        collegeId: 1,
        departmentName: "국어국문학과",
        departmentImageUrl: "",
      },
      {
        departmentId: 2,
        collegeId: 1,
        departmentName: "중어중문학과",
        departmentImageUrl: "",
      },
    ],
    경영대학: [
      {
        departmentId: 3,
        collegeId: 2,
        departmentName: "경영학과",
        departmentImageUrl: "",
      },
      {
        departmentId: 4,
        collegeId: 2,
        departmentName: "회계학과",
        departmentImageUrl: "",
      },
    ],
  });

  const [selectedCollege, setSelectedCollege] = useState("인문대학");

  const handleSelect = (e) => {
    setSelectedCollege(e.target.value);
  };

  return (
    <>
      <div className="grid px-5">
        <div className="grid">
          <div className="w-fit border-2 rounded-[10px] border-black grid py-1 px-2">
            <select name="학과" onChange={handleSelect} value={selectedCollege}>
              {Object.keys(posts).map((collegeName) => (
                <option value={collegeName} key={collegeName}>
                  {collegeName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-6 pt-5 gap-9">
          {posts[selectedCollege].map((department) => (
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
};

export default Home;
