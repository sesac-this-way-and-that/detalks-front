import { useEffect, useRef, useState } from "react";
import "../../styles/questionDetailPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { QuestionDetail } from "../../types/question";
import authStore from "../../store/authStore";
import { useInfoStore } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRagular } from "@fortawesome/free-regular-svg-icons";
import DOMPurify from "dompurify";

import AnswerItem from "./AnswerItem";
import AnswerCreate from "./AnswerCreate";

export default function QuestionDetailPage() {
  const { authToken } = authStore();
  const navigate = useNavigate();
  const userData = useInfoStore((state) => state.userInfo);

  const { questionId } = useParams<{ questionId: string }>();
  const [questionData, setQuestionData] = useState<QuestionDetail>();
  const [voteCount, setVoteCount] = useState<number>(-1);

  const [formattedText, setFormattedText] = useState<string>("");
  const [textAreaInputValue, setTextAreaInputValue] = useState<string>("");

  const [isBookMarked, setIsBookMarked] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isAnswerVoted, setIsAnswerVoted] = useState<boolean>(false);

  const [hasUserAnswered, setHasUserAnswered] = useState<boolean>(false);

  const handleVoteIncrement = async () => {
    if (!authToken) {
      alert("투표하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    const url = `${process.env.REACT_APP_API_SERVER}/votes/question/${questionData?.questionId}?voteState=true`;
    try {
      await axios.post(
        url,
        { voteState: true },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setVoteCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error incrementing vote:", error);
      alert("투표는 한 번만 가능합니다.");
    }
  };

  const handleVoteDecrement = async () => {
    if (!authToken) {
      alert("투표하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    const url = `${process.env.REACT_APP_API_SERVER}/votes/question/${questionData?.questionId}?voteState=false`;
    try {
      await axios.post(
        url,
        { voteState: false },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setVoteCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error decrementing vote:", error);
      alert("투표는 한 번만 가능합니다.");
    }
  };

  useEffect(() => {
    const formatTextToHTML = (text: string) => {
      const regex = /`([^`]*)`/g;
      const parts: string[] = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        const start = match.index;
        const end = regex.lastIndex;
        const before = text.slice(lastIndex, start);
        const code = match[1];

        // Add the text before the code block
        if (before) {
          parts.push(before.replace(/\n/g, "<br>"));
        }

        // Add the code block with highlighting and preserve line breaks within the code block
        parts.push(
          `<span style="background-color: lightgray; font-family: monospace; white-space: pre-wrap; display: inline-block;">${code.replace(
            /\n/g,
            "<br>"
          )}</span>`
        );

        lastIndex = end;
      }

      // Add the remaining text after the last code block
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex).replace(/\n/g, "<br>"));
      }

      return parts.join("");
    };

    setFormattedText(formatTextToHTML(textAreaInputValue));
  }, [textAreaInputValue]);

  const handleSelectedQuesId = async () => {
    const url = `${process.env.REACT_APP_API_SERVER}/questions/${questionId}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setQuestionData(response.data.data);
      setVoteCount(response.data.data.voteCount);
      setIsBookMarked(response.data.data.bookmarkState);

      setIsSolved(response.data.data.isSolved);

      // [추가] 이미 답변된 질문인지 확인
      const userAnswer = response.data.data.answerList.find(
        (answer: any) => answer.author.memberIdx === userData?.idx
      );
      setHasUserAnswered(!!userAnswer);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleDeleteQuestion = async () => {
    const urlVotes = `${process.env.REACT_APP_API_SERVER}/votes/question/${questionData?.questionId}`;
    try {
      await axios.delete(urlVotes, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const url = `${process.env.REACT_APP_API_SERVER}/questions/${questionData?.questionId}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      navigate("/questions");
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const [userDetail, setUserDetail] = useState({
    idx: userData?.idx,
    name: userData?.name || "default-name",
    summary: userData?.summary || "한 줄 소개가 없습니다.",
    about: userData?.about || "자기소개가 없습니다.",
    img: userData?.img || "default.jpg",
    qcount: userData?.qcount || 0,
    acount: userData?.acount || 0,
    rep: userData?.rep || 0,
  });
  const handleUserRep = async () => {
    if (!questionData?.author.memberIdx) return;

    const url = `${process.env.REACT_APP_API_SERVER}/member/idx/${questionData?.author.memberIdx}`;

    try {
      const response = await axios.get(url);
      const { data } = response.data;
      setUserDetail({
        idx: data.idx,
        name: data.name || "default-name",
        summary: data.summary || "한 줄 소개가 없습니다.",
        about: data.about || "자기소개가 없습니다.",
        img: data.img || "default.jpg",
        qcount: data?.qcount || 0,
        acount: data?.acount || 0,
        rep: data?.rep || 0,
      });
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  useEffect(() => {
    if (isSolved) {
      setIsAnswerVoted(true);
    } else {
      setIsAnswerVoted(false);
    }
    handleSelectedQuesId();
  }, []);
  useEffect(() => {
    handleUserRep();
  }, [questionData]);

  const handleBookMark = async () => {
    const url = `${process.env.REACT_APP_API_SERVER}/bookmarks/${questionData?.questionId}`;

    try {
      const response = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data && response.data.result === true) {
        setIsBookMarked(true);
      } else {
        console.error(
          "Bookmark operation failed or returned unexpected data:",
          response
        );
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  const handleUnBookMark = async () => {
    const url = `${process.env.REACT_APP_API_SERVER}/bookmarks/${questionData?.questionId}`;

    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data && response.data.result === true) {
        setIsBookMarked(false);
      } else {
        console.error(
          "Unbookmark operation failed or returned unexpected data:",
          response
        );
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  const toggleBookmark = () => {
    if (isBookMarked) {
      handleUnBookMark();
    } else {
      handleBookMark();
    }
  };

  // [답변]
  // 답변 재 랜더링
  const refreshAnswers = async () => {
    const url = `${process.env.REACT_APP_API_SERVER}/questions/${questionId}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setQuestionData(response.data.data);
      // [추가] 이미 답변된 질문인지 확인
      const userAnswer = response.data.data.answerList.find(
        (answer: any) => answer.author.memberIdx === userData?.idx
      );
      setHasUserAnswered(!!userAnswer);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  // 답변 채택
  const handleSelectAnswer = async (answerId: string) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_SERVER}/questions/${questionData?.questionId}/${answerId}/select`,
      null,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    if (response.data.result) {
      if (questionData) {
        const updatedQuestion: QuestionDetail = {
          ...questionData,
          answerList: questionData.answerList.map((answer) =>
            answer.answerId === answerId
              ? { ...answer, selected: true }
              : answer
          ),
          isSolved: true,
        };
        setQuestionData(updatedQuestion);
        alert("답변이 성공적으로 채택되었습니다.");
        window.location.reload();
      }
    } else {
      alert("답변 채택에 실패했습니다..");
      window.location.reload();
    }
  };

  const htmlMessage = questionData?.questionContent?.replace(/\n/g, "<br/>");
  const escapedHtmlMessage = htmlMessage ? DOMPurify.sanitize(htmlMessage) : "";

  return (
    <section className="questionDetailpage_wrapper">
      <article className="closed_container1" key={questionData?.questionId}>
        <div className="closed_header">
          <h1 className="headerTitle">문제 해결</h1>
        </div>
        <div className="question_container">
          <div className="question_section1">
            {questionData?.questionTitle}
            {isSolved && "[해결]"}
          </div>
          <div className="question_section2">
            <div className="section2_1">
              <div className="questionStats statsList">
                {voteCount} 투표 {/* Display vote count */}
              </div>
              <div className="questionStats statsList">
                {questionData?.viewCount} 열람
              </div>
              <div className="questionStats statsList">
                {questionData?.questionRep} 현상금
              </div>
            </div>
            <div className="section2_2">
              <div className="profileStats statsList">
                <img
                  src={
                    process.env.REACT_APP_STATIC_SERVER +
                    "/" +
                    questionData?.author.memberImg
                  }
                  alt=""
                  style={{ width: "20px", height: "20px", borderRadius: "50%" }}
                />
              </div>
              <div className="profileStats statsList">
                {questionData?.author.memberName}
                <span className="viewCountSpan">{userDetail.rep}</span>
              </div>
              <div className="profileStats statsList">
                {questionData?.createdAt.toString().split("T")[0]}
              </div>
            </div>
          </div>
          <div className="question_section3">
            <div className="section3_sideBar">
              <button
                className="answerBtn answer_likeBtn"
                onClick={handleVoteIncrement}
                disabled={userData?.name === questionData?.author.memberName}
              >
                ▲
              </button>
              <div>{voteCount}</div>
              <button
                className="answerBtn answer_disLikeBtn"
                onClick={handleVoteDecrement}
                disabled={userData?.name === questionData?.author.memberName}
              >
                ▼
              </button>
              <div className="resolve_bookMark" onClick={toggleBookmark}>
                {isBookMarked ? (
                  <FontAwesomeIcon
                    icon={faBookmarkRagular}
                    style={{ color: "hsl(210,8%,68%)" }}
                  />
                ) : (
                  <FontAwesomeIcon icon={faBookmark} />
                )}
              </div>
              <div className="solvedMark">
                {isSolved && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: "hsl(148, 70%, 31%)" }}
                  />
                )}
              </div>
            </div>
            <div className="section3_content">
              <div
                className="section3_body"
                dangerouslySetInnerHTML={{ __html: escapedHtmlMessage }}
              ></div>
              <div className="tagList_container">
                {questionData?.tagNameList.map((tag, i) => {
                  return (
                    <div className="tagList" key={i}>
                      {tag}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {userData?.name === questionData?.author.memberName && (
            <div className="question_section4">
              <div
                className="section_text"
                onClick={() =>
                  navigate(`/question/update/${questionData?.questionId}`)
                }
              >
                수정
              </div>
              <div className="section_text" onClick={handleDeleteQuestion}>
                삭제
              </div>
            </div>
          )}
        </div>
      </article>
      <article className="closed_container2">
        {questionData?.answerCount !== 0 && (
          <h1 className="subTitle">{questionData?.answerCount} 답변</h1>
        )}
      </article>
      {/* 답변 리스트 map */}
      {questionData?.answerList.map((answer) => (
        <AnswerItem
          key={answer.answerId}
          answer={answer}
          refreshAnswers={refreshAnswers}
          isQuestionAuthor={userData?.idx === questionData.author.memberIdx}
          handleSelectAnswer={handleSelectAnswer}
        />
      ))}
      <article className="closed_container4">
        {/* 사용자가 이미 답변을 작성했을 경우 입력 비활성화 */}
        {userData?.name === questionData?.author.memberName ||
          (!hasUserAnswered && (
            <AnswerCreate
              questionId={questionData?.questionId}
              refreshAnswers={refreshAnswers}
            />
          ))}
      </article>
    </section>
  );
}
