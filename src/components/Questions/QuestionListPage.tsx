import { useEffect, useState } from "react";
import "../../styles/questionListPage.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { authToken } = authStore();

  const [qnaListData, setQnaListData] = useState<QnaListData>();
  const [spage, setSPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [filterBy, setFilterBy] = useState<string>("");

  useEffect(() => {
    getQuestionList(spage);
  }, [spage]);

  const getQuestionList = async (spage: number) => {
    try {
      const response = await axios.get(
        // `${process.env.REACT_APP_API_SERVER}/questions?page=${spage}`,
        `${process.env.REACT_APP_API_SERVER}/questions?sortBy=${sortBy}&size=1&page=${spage}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      let listData = response.data.data;

      console.log("response: ", response.data);

      setQnaListData(listData);
      setTotalPages(listData.totalPages);
    } catch (error) {
      console.error("error: ", error);
    } finally {
      // setLoading(false);
    }
  };

  // 페이지네이션 로직

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
  };

  console.log(qnaListData?.content[0].questionTitle);
  const pagesRenderer = () => {
    const pages = [];
    if (totalPages < endPagePerTen) {
      for (let i = startPagePerTen; i <= totalPages; i++) {
        pages.push(
          <button key={i} onClick={() => changePage(i)}>
            {i}
          </button>
        );
      }
    } else {
      for (let i = startPagePerTen; i <= endPagePerTen; i++) {
        pages.push(
          <button key={i} onClick={() => changePage(i)}>
            {i}
          </button>
        );
      }
    }
    return pages;
  };

  return (
    <section>
      <article className="qna-header">
        <h2 className="title">질의응답</h2>
        <div className="select-orderby-type">
          <button
            type="button"
            className="orderby-new"
            onClick={() => setSortBy("createdAt")}
          >
            최신순
          </button>
          <button
            type="button"
            className="orderby-vote"
            onClick={() => setSortBy("voteCount")}
          >
            평점순
          </button>
          <button type="button" className="filter-noanswer">
            답변없는 질문
          </button>
        </div>
      </article>
      <article className="qna-list-container">
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
        <p>총 페이지 수: {qnaListData?.totalPages}</p>
        <p>현재 페이지: {qnaListData?.number}</p>
      </article>
      <article className="qna-footer">
        <div className="qna-total">총 {qnaListData?.totalElements} 질문</div>
        <div className="pages-button">
          {startPagePerTen === 1 ? null : (
            <button type="button" onClick={() => changePage(1)}>
              맨 처음 페이지
            </button>
          )}
          {startPagePerTen === 1 ? null : (
            <button
              type="button"
              onClick={() => changePage(startPagePerTen - 1 - cpage)}
            >
              이전
            </button>
          )}
          {pagesRenderer()}
          {totalPages <= endPagePerTen ? null : (
            <button
              type="button"
              onClick={() => changePage(endPagePerTen + cpage)}
            >
              다음
            </button>
          )}
          {totalPages <= endPagePerTen ? null : (
            <button type="button" onClick={() => changePage(totalPages)}>
              맨 끝 페이지
            </button>
          )}
        </div>
      </article>
    </section>
  );
}