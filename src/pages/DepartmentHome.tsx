import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

// export async function getUniv(id: string) {
//   const response = await fetch(``);
//   return response.json();
// }

export default function DepartmentHome() {
  const { departmentId } = useParams();
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await api.get(`mentorlist/${departmentId}`);
        setMentors(response.data);
      } catch (error) {
        console.log("Error fetching mentors:", error);
      }
    };

    if (departmentId) {
      fetchMentors();
    }
  }, [departmentId]);

  const [posts, getPosts] = useState({
    "1학년": [
      {
        courseName: "공학수학1",
        mentors: [
          {
            nickName: "cs1",
            courseName: "공학수학1",
            gradeStatus: "B",
            yearInUni: 2,
            cieatStock: 0,
            cieatGrade: 0,
          },
          {
            nickName: "cs2",
            courseName: "공학수학1",
            gradeStatus: "A",
            yearInUni: 2,
            cieatStock: 0,
            cieatGrade: 0,
          },
        ],
      },
    ],
    2: [
      {
        courseName: "공학수학1",
        mentors: [
          {
            nickName: "cs1",
            courseName: "공학수학1",
            gradeStatus: "B",
            yearInUni: 2,
            cieatStock: 0,
            cieatGrade: 0,
          },
          {
            nickName: "cs2",
            courseName: "공학수학1",
            gradeStatus: "A",
            yearInUni: 2,
            cieatStock: 0,
            cieatGrade: 0,
          },
        ],
      },
    ],
  });

  const [grade, setGrade] = useState([
    {
      id: 1,
      gradeName: "1학년",
    },
    { id: 2, gradeName: "2학년" },
    { id: 3, gradeName: "3학년" },
  ]);
  //useState 값에는 자동으로 본인의 학년 선택됨.
  const [selectedGrade, setSelectedGrade] = useState("1학년");

  const handleSelect = (e) => {
    setSelectedGrade(e.target.value);
  };

  return (
    <>
      <div className="grid grid-cols-2">
        <div className="">
          정보통신학과
          <div className="bg-black h-1"></div>
          <select name="학과" onChange={handleSelect} value={selectedGrade}>
            {grade.map((grade) => (
              <option value={grade.id}>{grade.gradeName}</option>
            ))}
          </select>
          <div>
            {posts[selectedGrade]?.map((post) => (
              <div key={post.courseName}>
                <h3>{post.courseName}</h3>
                {post.mentors.map((mentor) => (
                  <div key={mentor.nickName}>
                    {" "}
                    {/* 고유한 key prop 추가 */}
                    <p>{mentor.nickName}</p>
                    <p>
                      {mentor.gradeStatus}학년 / {mentor.courseName}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-yellow-100 w-full">
          {/* {mentors.map((mentor) => {
            <div key={mentor.id}>
              <img alt={"프로필"} />
              <p>{mentor.name}</p>
              <p>
                {mentor.grade}학년 / {mentor.departmentName}
              </p>
            </div>;
          })} */}
        </div>
      </div>
    </>
  );
}
