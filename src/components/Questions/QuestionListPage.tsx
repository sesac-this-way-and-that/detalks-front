import { useEffect, useState } from "react";
import "../../styles/questionListPage.scss";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import authStore from "../../store/authStore";

/* 
{
    "result": true,
    "msg": "질문 리스트 조회 성공",
    "data": {
        "totalPages": 2, << 총 페이지 수
        "totalElements": 11, << 총 게시글 수
        "size": 10, << 페이지 당 글 수
        "content": [
            {
                "questionId": 11,
                "questionTitle": "졸려요 잘래요",
                "questionContent": "하나만 더 만들어서 시험...",
                "createdAt": "2024-06-14T18:56:02",
                "modifiedAt": "2024-06-14T18:56:02",
                "viewCount": 22,
                "voteCount": 1,
                "questionState": true,
                "isSolved": false,
                "author": {
                    "memberIdx": 11,
                    "memberName": "asdf"
                },
                "bookmarkState": false,
                "answerCount": 1,
                "answerList": [
                    {
                        "answerId": 5,
                        "answerContent": "Example Answer 5",
                        "createdAt": "2024-06-15T02:53:07",
                        "modifiedAt": "2024-06-15T02:53:07",
                        "answerState": true,
                        "voteCount": 0,
                        "isSelected": false,
                        "author": {
                            "memberIdx": 6,
                            "memberName": "Member6"
                        }
                    }
                ],
                "tagNameList": [
                    "Java",
                    "react",
                    "Kotlin"
                ],
                "questionRep": 0
            }
        ],
        "number": 1, << 현재 페이지 인덱스
        "sort": {
            "empty": false,
            "sorted": true,
            "unsorted": false
        },
        "numberOfElements": 1,
        "first": false, << 현재 페이지가 첫 페이지인가
        "last": true, << 현재 페이지가 끝 페이지인가
        "pageable": {
            "pageNumber": 1,
            "pageSize": 10,
            "sort": {
                "empty": false,
                "sorted": true,
                "unsorted": false
            },
            "offset": 10,
            "paged": true,
            "unpaged": false
        },
        "empty": false
    },
    "status": "200",
    "errorType": null,
    "token": null
}
*/

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

  const [qnaListData, setQnaListData] = useState<QnaListData>();
  const [noQuestion, setNoQuestion] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [spage, setSPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  // const [sortDESC, setSortDESC] = useState<boolean>(true);
  const [filterByAnswer, setFilterByAnswer] = useState<boolean>(false);

  useEffect(() => {
    if (state && state.searchResults) {
      setQnaListData(state.searchResults);
    } else {
      getQuestionList(spage);
    }
  }, [spage, state, sortBy, filterByAnswer]);

  const getQuestionList = async (spage: number) => {
    setLoading(true);
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
    } catch (error) {
      // if (error.response.data.status === 404) {
      setNoQuestion(true);
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
    setSPage(0);
  };
  const orderByVote = () => {
    // if (sortBy === "voteCount") {
    //   setSortDESC(!sortDESC);
    // }
    setSortBy("voteCount");
    setSPage(0);
  };
  const filterNoAnswer = () => {
    console.log(filterByAnswer);
    setFilterByAnswer(!filterByAnswer);
  };

  // 페이지네이션 기능

  // 0부터 시작하도록 서버에서 들어오는 페이지 수를 1부터 시작하도록 변환
  const cpage = spage + 1;

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
      <article className="qna-header">
        <h2 className="title">질의응답</h2>
        <button
          className="qna-write-question"
          onClick={() => navigate(`/question/create`)}
        >
          질문하기
        </button>
        <div className="select-orderby-type">
          <button type="button" className="orderby-new" onClick={orderByNew}>
            최신순
          </button>
          <button type="button" className="orderby-vote" onClick={orderByVote}>
            평점순
          </button>
          <button
            type="button"
            className="filter-noanswer"
            onClick={filterNoAnswer}
          >
            답변없는 질문
          </button>
        </div>
      </article>
      <article className="qna-list-container">
        {loading ? <div className="qna-loading">로딩중 입니다...</div> : null}
        {noQuestion ? (
          <div className="qna-no-question">질문글이 없습니다.</div>
        ) : null}
        {qnaListData?.content.map((qnaData) => {
          return (
            <div
              className="qna-container"
              key={qnaData.questionId}
              onClick={() => {
                navigate(`/question/${qnaData.questionId}`);
              }}
            >
              <div className="qna-container-side">
                <ul className="qna-state">
                  <li className="count-vote">{qnaData.voteCount} 평점</li>
                  <li className="count-answer">
                    {qnaData.answerList.length} 답변
                  </li>
                  <li className="count-view">{qnaData.viewCount} 열람</li>
                </ul>
              </div>
              <div className="qna-summary">
                <div className="qna-summary-title">{qnaData.questionTitle}</div>

                <div className="qna-summary-content">
                  {qnaData.questionContent}
                </div>

                <div className="qna-container-bottom">
                  <div className="qna-tag-list">
                    {qnaData.tagNameList.map((tagList, idx) => {
                      return (
                        <div className="qna-tag" key={idx}>
                          {tagList}
                        </div>
                      );
                    })}
                  </div>
                  <div className="qna-user-info">
                    <div className="qna-user-image-container">
                      <img
                        className="qna-user-image"
                        src={
                          process.env.REACT_APP_STATIC_SERVER + "/default2.png"
                        }
                        alt="프로필사진"
                      />
                    </div>
                    <div className="qna-user-name">
                      {qnaData.author.memberName}
                      <span>{qnaData.author.memberIdx}</span>
                    </div>
                    <div className="qna-created-at">
                      {qnaData.createdAt.toString()}
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
          {startPagePerTen === 1 ? null : (
            <button
              type="button"
              onClick={() => changePage(1)}
              className="page-button"
            >
              1
            </button>
          )}
          {startPagePerTen === 1 ? null : (
            <button
              type="button"
              onClick={() => changePage(cpage - 10)}
              className="page-button"
            >
              이전
            </button>
          )}
          {pagesRenderer()}
          {totalPages <= endPagePerTen ? null : (
            <button
              type="button"
              onClick={() => changePage(cpage + 10)}
              className="page-button"
            >
              다음
            </button>
          )}
          {totalPages <= endPagePerTen ? null : (
            <button
              type="button"
              onClick={() => changePage(totalPages)}
              className="page-button"
            >
              {totalPages}
            </button>
          )}
        </div>
      </article>
    </section>
  );
}
