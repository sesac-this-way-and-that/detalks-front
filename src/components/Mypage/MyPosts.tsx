// src/components/MyPosts.tsx

import React, { useState } from "react";

const MyPosts: React.FC = () => {
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
    {
      id: 6,
      type: "A",
      rating: 1,
      title: "Node.js에서 비동기 처리",
      date: "2024-06-05 12:00:00",
    },
    {
      id: 7,
      type: "A",
      rating: 1,
      title: "Node.js에서 비동기 처리",
      date: "2024-06-05 12:00:00",
    },
    {
      id: 8,
      type: "A",
      rating: 1,
      title: "Node.js에서 비동기 처리",
      date: "2024-06-05 12:00:00",
    },
    {
      id: 9,
      type: "A",
      rating: 1,
      title: "Node.js에서 비동기 처리",
      date: "2024-06-05 12:00:00",
    },
    {
      id: 10,
      type: "A",
      rating: 1,
      title: "Node.js에서 비동기 처리",
      date: "2024-06-05 12:00:00",
    },
    {
      id: 11,
      type: "A",
      rating: 1,
      title: "Node.js에서 비동기 처리",
      date: "2024-06-05 12:00:00",
    },
    {
      id: 12,
      type: "A",
      rating: 1,
      title: "Node.js에서 비동기 처리",
      date: "2024-06-05 12:00:00",
    },
    {
      id: 13,
      type: "A",
      rating: 1,
      title: "Node.js에서 비동기 처리",
      date: "2024-06-05 12:00:00",
    },
    {
      id: 14,
      type: "A",
      rating: 4,
      title: "GraphQL을 사용한 데이터 페칭",
      date: "2024-06-05 13:45:30",
    },
  ];

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = questions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(questions.length / itemsPerPage);

  return (
    <div>
      <h3>내 활동</h3>
      <div>
        <div>
          <ul>
            <li>전체</li>
            <li>질문</li>
            <li>답변</li>
          </ul>
        </div>
        <div>
          <ul>
            <li>최신순</li>
            <li>평점순</li>
            <li>채택 없는 글</li>
          </ul>
        </div>
      </div>
      <div>
        {currentItems.map((question) => (
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
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
