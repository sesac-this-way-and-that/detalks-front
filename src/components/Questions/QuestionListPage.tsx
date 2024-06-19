import { useEffect, useState } from "react";
import "../../styles/questionListPage.scss";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import authStore from "../../store/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faCheck,
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
  // console.log(state.searchResults);
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
  // const [spage, setSPage] = useState<number>(Number(pageQuery) - 1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  // const [sortDESC, setSortDESC] = useState<boolean>(true);
  const [filterByAnswer, setFilterByAnswer] = useState<boolean>(false);

  useEffect(() => {
    if (!pageQuery) setSPage(0);
    else if (Number(pageQuery) > 0) setSPage(Number(pageQuery) - 1);
    else if (Number(pageQuery) === totalPages) setSearchParams(pageQuery);
    else setSPage(0);

    if (!sortByQuery) setSortBy("createAt");
    else setSortBy(sortByQuery);
  }, []);

  useEffect(() => {
    setLoading(true);
    if (state /* && state.searchResults */) {
      setLoading(false);
      if (state.searchResults !== null) {
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
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/questions?sortBy=${sortBy}&page=${spage}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      let listData = response.data.data;

      console.log("response: ", response.data);

      // if (sortDESC) {
      //   setQnaList(listData.content);
      // } else {
      //   setQnaList(listData.content.reverse());
      // }
      setNoQuestion(false);
      setQnaListData(listData);
      setTotalPages(listData.totalPages);
      setSearchParams({ sortBy: `${sortBy}`, page: `${spage + 1}` });
    } catch (error: any) {
      // if (error.response.status === 404) {
      setNoQuestion(true);
      // } else {
      //   console.log(error.response.data);
      // }
      console.error("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  // 정렬 기능

  const orderByNew = () => {
    // if (sortBy === "createdAt") {
    //   setSortDESC(!sortDESC);
    // }
    setSortBy("createdAt");
    // setSPage(0);
  };
  const orderByVote = () => {
    // if (sortBy === "voteCount") {
    //   setSortDESC(!sortDESC);
    // }
    setSortBy("voteCount");
    // setSPage(0);
  };
  const filterNoAnswer = () => {
    console.log(filterByAnswer);
    setFilterByAnswer(!filterByAnswer);
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

  return (
    <section className="qna-list-page">
      {/* <p>spage: {spage}</p>
      <p>cpage: {cpage}</p>
      <p>pageQuery: {pageQuery}</p>
      <p>totalPages: {totalPages}</p> */}
      <article className="qna-header">
        <h2 className="title">질의응답</h2>
        <button
          className="qna-write-question"
          onClick={() => navigate(`/question/create`)}
        >
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
              평점순
            </button>
            <button
              type="button"
              className={`order-btn ${
                sortByQuery === "noAnswer" ? "active-tap" : ""
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
        {qnaListData?.content.map((qnaData) => {
          return (
            <div className="qna-container">
              <div className="qna-container-side">
                <ul className="qna-state">
                  <li className="state-count count-vote">
                    {qnaData.voteCount} 투표
                  </li>
                  <li className="state-count count-answer">
                    {qnaData.answerList.length !== 0 && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{
                          color: "#0c7cc2",
                          paddingTop: "3px",
                        }}
                      />
                    )}
                    {qnaData.answerList.length} 답변
                  </li>
                  <li className="state-count count-view">
                    {qnaData.viewCount} 열람
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
                    key={qnaData.questionId}
                    onClick={() => {
                      navigate(`/question/${qnaData.questionId}`);
                    }}
                  >
                    {qnaData.questionContent}
                  </div>
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
                        alt="프로필사진"
                      />
                    </div>
                    <div className="qna-user-name">
                      {qnaData.author.memberName}
                    </div>
                    <div className="qna-user-rep">
                      {qnaData.author.memberRep}
                    </div>
                    <div className="qna-created-at">
                      {qnaData.createdAt.toString().split("T")[0]}
                      {/* <br /> */}
                      {/* {qnaData.createdAt.toString().split("T")[1]} */}
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
          {/* {startPagePerTen === 1 ? null : ( */}
          <button
            type="button"
            onClick={() => changePage(1)}
            className={`page-button ${
              startPagePerTen === 1 ? "visibility-hidden" : ""
            }`}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
          {/* )} */}
          {/* {startPagePerTen === 1 ? null : ( */}
          <button
            type="button"
            onClick={() => changePage(Number(pageQuery) - 10)}
            className={`page-button prev-button ${
              startPagePerTen === 1 ? "visibility-hidden" : ""
            }`}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          {/* )} */}
          {pagesRenderer()}
          {/* {totalPages <= endPagePerTen ? null : ( */}
          <button
            type="button"
            onClick={() => changePage(Number(pageQuery) + 10)}
            className={`page-button next-button ${
              totalPages <= endPagePerTen ? "visibility-hidden" : ""
            }`}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          {/* )} */}
          {/* {totalPages <= endPagePerTen ? null : ( */}
          <button
            type="button"
            onClick={() => changePage(totalPages)}
            className={`page-button ${
              totalPages <= endPagePerTen ? "visibility-hidden" : ""
            }`}
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </button>
          {/* )} */}
        </div>
      </article>
    </section>
  );
}
