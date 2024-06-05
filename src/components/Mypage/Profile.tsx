import React from "react";

interface ProfileProps {
  userInfo: {
    name: string;
    summary: string;
    about: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ userInfo }) => {
  const questions = [
    {
      id: 1,
      type: "Q",
      rating: 1,
      title: "백엔드 작업하다가 403에러가 나와요",
      date: "2024-06-04 18:11:55",
    },
    {
      id: 2,
      type: "Q",
      rating: 2,
      title: "프론트엔드에서 CORS 문제를 해결하는 방법?",
      date: "2024-06-05 09:23:44",
    },
    {
      id: 3,
      type: "Q",
      rating: 5,
      title: "React에서 상태 관리를 어떻게 해야 할까요?",
      date: "2024-06-05 10:30:21",
    },
    {
      id: 4,
      type: "Q",
      rating: 3,
      title: "TypeScript 타입 정의 질문",
      date: "2024-06-05 11:11:11",
    },
    {
      id: 5,
      type: "A",
      rating: 1,
      title: "Node.js에서 비동기 처리",
      date: "2024-06-05 12:00:00",
    },
  ];

  return (
    <>
      <div>
        <h3>나의 능력치</h3>
        <div>
          <p>20</p>
          <p>평가</p>
        </div>
        <div>
          <p>20</p>
          <p>팔로워</p>
        </div>
        <div>
          <p>20</p>
          <p>질문</p>
        </div>
        <div>
          <p>20</p>
          <p>답변</p>
        </div>
      </div>
      <div>
        <h3>자기소개</h3>
        <p>{userInfo.about}</p>
      </div>
      <div>
        <h3>Top 5</h3>
        {questions.map((question) => (
          <ul key={question.id}>
            <li>
              <span>{question.type}</span>
            </li>
            <li>
              <span>{question.rating} 평점</span>
            </li>
            <li>
              <span>{question.title}</span>
            </li>
            <li>{question.date}</li>
          </ul>
        ))}
      </div>
    </>
  );
};

export default Profile;
