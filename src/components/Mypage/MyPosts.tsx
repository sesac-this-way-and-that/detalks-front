import axios from "axios";
import React, { useEffect, useState } from "react";
import { useInfoStore } from "../../store";
import authStore from "../../store/authStore";
import { Link, useParams } from "react-router-dom";

interface Question {
  bookmarkId?: number;
  id: number;
  titleOrContent: string;
  isQuestion: boolean;
  createdAt: string;
  voteCount: number;
  questionId: number;
  isSolved: boolean;
  isSelected: boolean;
}

const MyPosts: React.FC = () => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [sortBy, setSortBy] = useState<string>("최신순");
  const [filterBy, setFilterBy] = useState<string>("전체");
  const userData = useInfoStore((state) => state.userInfo);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const getToken = authStore((state) => state.authToken);
  const { userId } = useParams<{ userId: string }>();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchQuestions = async () => {
    try {
      let apiUrl;
      if (userData?.idx) {
        apiUrl = `${process.env.REACT_APP_API_SERVER}/mypage/${userData?.idx}/activities/recent`;
      } else {
        apiUrl = `${process.env.REACT_APP_API_SERVER}/mypage/${userId}/activities/recent`;
      }

      // Adjust API URL based on sort criteria
      if (sortBy === "평점순") {
        apiUrl = apiUrl.replace("recent", "top-votes");
      }

      const response = await axios.get(apiUrl);
      let { data } = response.data;
      if (sortBy === "채택 없는 글") {
        data = data.filter(
          (question: Question) =>
            question.isSelected === null || question.isSelected === false
        );
      }
      setAllQuestions(data);
    } catch (error) {
      console.error("API 호출 중 오류 발생:", error);
    }
  };

  const bookmarkQuestions = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_SERVER}/bookmarks?sortBy=voteCount`;
      const token = getToken;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response.data;
      setAllQuestions(data.content);
    } catch (error) {
      console.error("북마크 API 호출 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    const loadQuestions = async () => {
      if (filterBy === "북마크") {
        await bookmarkQuestions();
      } else {
        await fetchQuestions();
      }
    };
    loadQuestions();
  }, [sortBy, filterBy, userData?.idx, userId]);

  useEffect(() => {
    filterQuestions();
  }, [allQuestions, filterBy]);

  const filterQuestions = () => {
    let filteredData = [...allQuestions];

    switch (filterBy) {
      case "질문":
        filteredData = filteredData.filter((question) => question.isQuestion);
        break;
      case "답변":
        filteredData = filteredData.filter((question) => !question.isQuestion);
        break;
      default:
        break;
    }
    setFilteredQuestions(filteredData);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuestions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const renderPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pages = [];
    if (startPage > 1) {
      pages.push(
        <button
          key="first"
          className={1 === currentPage ? "active" : ""}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage >= 2) {
        pages.push(<span key="dots1">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={i === currentPage ? "active" : ""}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage <= totalPages - 1) {
        pages.push(<span key="dots2">...</span>);
      }
      pages.push(
        <button
          key="last"
          className={totalPages === currentPage ? "active" : ""}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  const handleSortChange = (criteria: string) => {
    if (criteria !== sortBy) {
      setSortBy(criteria);
      setCurrentPage(1);
    }
  };

  const handleFilterChange = (criteria: string) => {
    if (criteria !== filterBy) {
      setFilterBy(criteria);
      setCurrentPage(1);
    }
  };

  const getDisplayName = (name: string) => {
    return name.length > 20 ? name.slice(0, 20) + "..." : name;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <>
      <h3>내 활동</h3>
      <div className="mypost-filter-container">
        <div className="mypost-filter-1">
          <ul>
            <li
              className={filterBy === "전체" ? "active-filter" : ""}
              onClick={() => handleFilterChange("전체")}
            >
              전체
            </li>
            <li
              className={filterBy === "질문" ? "active-filter" : ""}
              onClick={() => handleFilterChange("질문")}
            >
              질문
            </li>
            <li
              className={filterBy === "답변" ? "active-filter" : ""}
              onClick={() => handleFilterChange("답변")}
            >
              답변
            </li>
          </ul>
          {getToken && (
            <div
              className={
                filterBy === "북마크" ? "active-filter bookmark" : "bookmark"
              }
              onClick={() => handleFilterChange("북마크")}
            >
              북마크
            </div>
          )}
        </div>
        <div className="mypost-filter-2">
          <ul>
            <li
              className={sortBy === "최신순" ? "active-sort" : ""}
              onClick={() => handleSortChange("최신순")}
            >
              최신순
            </li>
            <li
              className={sortBy === "평점순" ? "active-sort" : ""}
              onClick={() => handleSortChange("평점순")}
            >
              평점순
            </li>
            <li
              className={sortBy === "채택 없는 글" ? "active-sort" : ""}
              onClick={() => handleSortChange("채택 없는 글")}
            >
              채택 없는 글
            </li>
          </ul>
        </div>
      </div>
      <div className="mypage-profile-top">
        <div className="box">
          {filteredQuestions.length > 0 ? (
            <>
              {currentItems.map((question) => (
                <Link to={`/question/${question.questionId}`} key={question.id}>
                  <ul>
                    <li>
                      {question.isQuestion ? (
                        <span className={question.isSolved ? "is-solved" : ""}>
                          Q
                        </span>
                      ) : (
                        <span
                          className={question.isSelected ? "is-selected" : ""}
                        >
                          A
                        </span>
                      )}
                    </li>
                    <li>
                      {question.isQuestion ? (
                        <span
                          className={question.isSolved ? "is-solved-vote" : ""}
                        >
                          {question.voteCount} 투표
                        </span>
                      ) : (
                        <span
                          className={
                            question.isSelected ? "is-selected-vote" : ""
                          }
                        >
                          {question.voteCount} 투표
                        </span>
                      )}
                    </li>
                    <li>
                      <span>
                        {getDisplayName(question.titleOrContent || "")}
                      </span>
                    </li>
                    <li>{formatDate(question.createdAt)}</li>
                  </ul>
                </Link>
              ))}
            </>
          ) : (
            <ul>
              <li></li>
              <li></li>
              <li>
                <span>작성하신 질문이 없습니다.</span>
              </li>
              <li></li>
            </ul>
          )}
        </div>
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <div className="numbers-btn">{renderPageNumbers()}</div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </>
  );
};

export default MyPosts;
