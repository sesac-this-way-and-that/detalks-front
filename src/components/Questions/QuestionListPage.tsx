import { useEffect, useState } from "react";
import "../../styles/questionListPage.scss";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import authStore from "../../store/authStore";
import "../../styles/index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAward,
} from "@fortawesome/free-solid-svg-icons";

interface Question {
  questionId: number;
  questionTitle: string;
  questionContent: string;
  createdAt: Date;
  modifiedAt: Date;
  viewCount: number;
  voteCount: number;
  questionState: boolean; // 관리자에 의해 차단된 상태인지
  isSolved: boolean;
  author: {
    memberIdx: number;
    memberName: string;
    memberRep: number;
    memberImg: string;
  };
  bookmarkState: boolean;
  answerCount: number;
  answerList: Answer[];
  tagNameList: string[];
  questionRep: number; // 질문에 걸린 평판?
}

interface Answer {
  answerId: number;
  answerContent: string;
  createdAt: Date;
  modifiedAt: Date;
  answerState: boolean;
  voteCount: number;
  isSelected: boolean;
  author: {
    memberIdx: number;
    memberName: string;
  };
}

interface QnaListData {
  totalPages: number; // 총 페이지 수
  totalElements: number; // 총 질문글 수
  size: number; // 페이지 당 글 수
  content: Question[]; // 질문글 목록
  number: number; // 현재 페이지 인덱스
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number; // 현재 페이지에 포함된 질문글 수
  first: boolean; // 현재 페이지가 첫 페이지인가
  last: boolean; // 현재 페이지가 끝 페이지인가
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number; // 현재 페이지 이전에 있는 글 수?
    paged: boolean;
    unpaged: boolean;
  };
  empty: boolean;
}

export default function QuestionListPage() {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const { authToken } = authStore();

  // query 관련
  const [searchParams, setSearchParams] = useSearchParams();
  const pageQuery = searchParams.get("page");
  const sortByQuery = searchParams.get("sortBy");

  const [noQuestion, setNoQuestion] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  // state 관련
  const [qnaListData, setQnaListData] = useState<QnaListData | null>();
  const [spage, setSPage] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [filterByAnswer, setFilterByAnswer] = useState<boolean>(false);

  // 마운트 시 작동
  useEffect(() => {
    if (!pageQuery) setSPage(0);
    else if (Number(pageQuery) > 0) setSPage(Number(pageQuery) - 1);
    else if (Number(pageQuery) === totalPages) setSearchParams(pageQuery);
    else setSPage(0);

    if (!sortByQuery) setSortBy("createAt");
    else setSortBy(sortByQuery);
  }, []);

  // 마운트 & 업데이트 시 작동
  useEffect(() => {
    setLoading(true);
    if (state) {
      setLoading(false);
      if (state.searchResults !== false) {
        setNoQuestion(false);
        setQnaListData(state.searchResults);
        setTotalPages(state.searchResults.totalPages);
      } else {
        setNoQuestion(true);
        setQnaListData(null);
      }
    } else {
      getQuestionList(spage == null ? 0 : spage);
    }
  }, [spage, state, sortBy, filterByAnswer]);

  const getQuestionList = async (spage: number) => {
    try {
      if (!filterByAnswer) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/questions?sortBy=${sortBy}&page=${spage}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        let listData = response.data.data;

        setNoQuestion(false);
        setQnaListData(listData);
        setTotalPages(listData.totalPages);
        setSearchParams({ sortBy: `${sortBy}`, page: `${spage + 1}` });
      } else {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/questions/unAnswered?page=${spage}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        let listData = response.data.data;

        setNoQuestion(false);
        setQnaListData(listData);
        setTotalPages(listData.totalPages);
        setSearchParams({ page: `${spage + 1}` });
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        setNoQuestion(true);
      }
      console.error("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  // 정렬 기능

  const orderByNew = () => {
    setSortBy("createdAt");
    setFilterByAnswer(false);
    setSPage(0);
  };
  const orderByVote = () => {
    setSortBy("voteCount");
    setFilterByAnswer(false);
    setSPage(0);
  };
  const filterNoAnswer = () => {
    setFilterByAnswer(!filterByAnswer);
    setSortBy("createdAt");
    setSPage(0);
  };

  // 페이지네이션 기능

  // 0부터 시작하도록 서버에서 들어오는 페이지 수를 1부터 시작하도록 변환
  let cpage = (spage == null ? 0 : spage) + 1;

  // 페이지 목록에 페이지가 10개씩 있을 때 현재 페이지에 대한 끝 번호
  // (현재 페이지가 1~10이면 10, 11~20이면 20)
  const endPagePerTen = Math.ceil(cpage / 10) * 10;
  // 페이지 목록에 페이지가 10개씩 있을 때 현재 페이지에 대한 시작 번호
  // (현재 페이지가 1~10이면 1, 11~20이면 11)
  const startPagePerTen = endPagePerTen - 9;

  // 클릭한 페이지로 이동
  const changePage = (selectPage: number) => {
    if (selectPage > totalPages) {
      setSPage(totalPages - 1);
    } else if (selectPage < 1) {
      setSPage(0);
    } else {
      setSPage(selectPage - 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 페이지 버튼 표시
  const pagesRenderer = () => {
    const pages = [];
    if (totalPages > endPagePerTen) {
      for (let i = startPagePerTen; i <= endPagePerTen; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => changePage(i)}
            className={i == cpage ? "page-button currentPage" : "page-button"}
          >
            {i}
          </button>
        );
      }
    } else {
      for (let i = startPagePerTen; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => changePage(i)}
            className={i == cpage ? "page-button currentPage" : "page-button"}
          >
            {i}
          </button>
        );
      }
    }
    return pages;
  };

  const toWritePage = () => {
    if (authToken) {
      navigate("/question/create");
    } else {
      navigate("/login");
    }
  };

  // 오늘과 작성일 연월일 비교하기
  const compareDate = (date: Date) => {
    const today = new Date();
    const dateYear = Number(date.toString().split("-")[0]);
    const dateMonth = Number(date.toString().split("-")[1]);
    const dateDate = Number(date.toString().split("-")[2].split("T")[0]);
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();
    if (
      dateYear === todayYear &&
      dateMonth === todayMonth &&
      dateDate === todayDate
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <section className="qna-list-page">
      <article className="qna-header">
        <h2 className="title">질의응답</h2>
        <button className="qna-write-question" onClick={toWritePage}>
          질문하기
        </button>
      </article>
      <article className="qna-list-container">
        <div className="select-orderby-type">
          <div className="orderby-box">
            <button
              type="button"
              className={`order-btn ${
                sortByQuery === "createdAt" ? "active-tap" : ""
              }`}
              onClick={orderByNew}
            >
              최신순
            </button>
            <button
              type="button"
              className={`order-btn ${
                sortByQuery === "voteCount" ? "active-tap" : ""
              }`}
              onClick={orderByVote}
            >
              투표순
            </button>
            <button
              type="button"
              className={`order-btn ${
                filterByAnswer === true ? "active-tap" : ""
              }`}
              onClick={filterNoAnswer}
            >
              답변없는 질문
            </button>
          </div>
        </div>
        {loading ? (
          <div className="qna-container">
            <div className="qna-loading">로딩중 입니다...</div>
          </div>
        ) : null}
        {noQuestion ? (
          <div className="qna-container">
            <p className="qna-empty">
              질문글이 없습니다.
              <span>질문하기 를 눌러 궁금한 내용을 질문해보세요!</span>
            </p>
          </div>
        ) : null}
        {qnaListData === undefined || qnaListData === null
          ? null
          : qnaListData.content.map((qnaData) => {
              return (
                <div
                  className={`qna-container${
                    qnaData.questionRep > 0 ? " isBountied" : ""
                  }`}
                  key={qnaData.questionId}
                  onClick={() => {
                    navigate(`/question/${qnaData.questionId}`);
                  }}
                >
                  <div className="qna-container-side">
                    <ul className="qna-state">
                      <li
                        className={`state-count count-vote ${
                          qnaData.voteCount === 0
                            ? "vote-zero"
                            : qnaData.voteCount > 0
                            ? "vote-plus"
                            : "vote-minus"
                        }`}
                      >
                        {qnaData.voteCount} 투표
                      </li>
                      {/* 답변이 없으면 회색 글씨, 답변이 있으면 파란색 글씨
                   채택된 답변이 있으면 테두리와 아이콘 */}
                      <li
                        className={`state-count count-answer 
                      ${
                        qnaData.answerCount > 0
                          ? qnaData.isSolved
                            ? "qna-solved"
                            : "exist-answer"
                          : ""
                      }`}
                      >
                        <FontAwesomeIcon
                          icon={faAward}
                          className={`award-icon ${
                            qnaData.isSolved ? "qna-solved" : "display-none"
                          }`}
                        />
                        {qnaData.answerList.length} 답변
                      </li>
                      <li className="state-count count-view">
                        {qnaData.viewCount} 열람
                      </li>
                      <li
                        className={`state-count count-rep ${
                          qnaData.questionRep > 0 ? "" : "display-none"
                        }`}
                      >
                        {qnaData.questionRep} 현상금
                      </li>
                    </ul>
                  </div>
                  <div className="qna-summary-container">
                    <div className="qna-summary">
                      <div className="qna-summary-title">
                        {qnaData.questionTitle}
                      </div>

                      <div
                        className="qna-summary-content"
                        dangerouslySetInnerHTML={{
                          __html: qnaData.questionContent, // html 태그가 있을 시 제거
                        }}
                      ></div>
                    </div>

                    <div className="qna-container-bottom">
                      <div className="qna-tag-list">
                        {qnaData.tagNameList.length < 5
                          ? qnaData.tagNameList.map((tagList, idx) => {
                              return (
                                <div className="qna-tag" key={idx}>
                                  {tagList}
                                </div>
                              );
                            })
                          : // 태그 수가 4개보다 많으면 4개까지만 출력 후 ... 표시
                            [...qnaData.tagNameList.slice(0, 5)].map(
                              (tagList, idx) => {
                                return (
                                  <div className="qna-tag" key={idx}>
                                    {idx !== 4 ? tagList : "..."}
                                  </div>
                                );
                              }
                            )}
                      </div>
                      <div className="qna-user-info">
                        <div className="qna-user-image-container">
                          <img
                            className="qna-user-image"
                            src={
                              process.env.REACT_APP_STATIC_SERVER +
                              "/" +
                              qnaData.author.memberImg
                            }
                          />
                        </div>
                        <div className="qna-user-name">
                          {qnaData.author.memberName}
                        </div>
                        <div className="qna-user-rep">
                          {qnaData.author.memberRep}
                        </div>
                        <div className="qna-created-at">
                          {/* 작성일이 오늘이면 시간만, 아니면 날짜만 표기 */}
                          {compareDate(qnaData.createdAt)
                            ? qnaData.createdAt.toString().split("T")[1]
                            : qnaData.createdAt.toString().split("T")[0]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </article>
      <article className="qna-footer">
        <div className="qna-total">
          총 {noQuestion ? 0 : qnaListData?.totalElements} 질문
        </div>
        <div className="pages-button">
          <button
            type="button"
            onClick={() => changePage(1)}
            className={`page-button ${
              startPagePerTen === 1 ? "visibility-hidden" : ""
            }`}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
          <button
            type="button"
            onClick={() => changePage(Number(pageQuery) - 10)}
            className={`page-button prev-button ${
              startPagePerTen === 1 ? "visibility-hidden" : ""
            }`}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          {pagesRenderer()}
          <button
            type="button"
            onClick={() => changePage(Number(pageQuery) + 10)}
            className={`page-button next-button ${
              totalPages <= endPagePerTen ? "visibility-hidden" : ""
            }`}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <button
            type="button"
            onClick={() => changePage(totalPages)}
            className={`page-button ${
              totalPages <= endPagePerTen ? "visibility-hidden" : ""
            }`}
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </button>
        </div>
      </article>
    </section>
  );
}
