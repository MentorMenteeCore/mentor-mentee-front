import { useEffect } from "react";

const MentorList = ({ searchResults }) => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    if (searchResults.length > 0) {
      setMentors(searchResults);
    }
  }, [searchResults]);

  const MentorCard = ({ mentor }) => {
    return (
      <div>
        <h3>{mentor.name}</h3>
        <p>{mentor.department}</p>
      </div>
    );
  };
  return (
    <>
      <div>
        {mentors.length > 0 ? (
          mentors.map((mentor) => {
            <MentorCard key={mentor.id} mentor={mentor} />;
          })
        ) : (
          <p>멘토를 찾을 수 없습니다.</p>
        )}
      </div>
    </>
  );
};
