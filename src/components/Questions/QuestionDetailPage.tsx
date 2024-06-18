import { SyntheticEvent, useEffect, useRef, useState } from "react";
import "../../styles/questionDetailPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { QuestionDetail } from "../../types/question";
import authStore from "../../store/authStore";
import { useInfoStore } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRagular } from "@fortawesome/free-regular-svg-icons";

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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [isBookMarked, setIsBookMarked] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  const [hasUserAnswered, setHasUserAnswered] = useState<boolean>(false);
  const handleVoteIncrement = async () => {
    const url = `${process.env.REACT_APP_API_SERVER}/votes/question/${questionData?.questionId}?voteState=true`;
    try {
      await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("Vote incremented successfully");
      setVoteCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error incrementing vote:", error);
    }
  };

  const handleVoteDecrement = async () => {
    const url = `${process.env.REACT_APP_API_SERVER}/votes/question/${questionData?.questionId}?voteState=false`;
    try {
      await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setVoteCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error decrementing vote:", error);
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

      console.log(
        "response.data.data.voteCount: ",
        response.data.data.voteCount
      );

      // [추가] 이미 답변된 질문인지 확인
      const userAnswer = response.data.data.answerList.find(
        (answer: any) => answer.author.memberIdx === userData?.idx
      );
      console.log("response.data.data: ", response.data.data);
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

      console.log("Associated votes deleted successfully", urlVotes);

      const url = `${process.env.REACT_APP_API_SERVER}/questions/${questionData?.questionId}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("Question deleted successfully");
      navigate("/questions");
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const processQuestionContent = (content: string) => {
    // Regular expression to match code blocks
    const codeBlockRegex =
      /<span style="background-color: lightgray; font-family: monospace; white-space: pre-wrap; display: inline-block;">([\s\S]*?)<\/span>/g;
    // Replace code blocks with styled <pre> and <code> tags
    return content.replace(codeBlockRegex, (match, p1) => {
      return `<pre style="background-color: lightgray; font-family: monospace; white-space: pre-wrap; display: inline-block;">${p1}</pre>`;
    });
  };

  const processedContent = questionData?.questionContent
    ? processQuestionContent(questionData.questionContent)
    : "";

  // const { userId } = useParams<{ userId: string }>();
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
  // const [userRep, setUserRep] = useState<number>(0);
  const handleUserRep = async () => {
    console.log(
      "questionData?.author.memberIdx, ",
      questionData?.author.memberIdx
    );
    if (!questionData?.author.memberIdx) return;

    const url = `${process.env.REACT_APP_API_SERVER}/member/idx/${questionData?.author.memberIdx}`;

    try {
      const response = await axios.get(url);
      const { data } = response.data;
      console.log("handleUserRep: ", data);
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
      console.log(userDetail.rep);
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };
  // console.log("userDetail: ", userDetail);
  useEffect(() => {
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
        console.log(response.data.msg);
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
        console.log(response.data.msg);
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

  // --- 답변
  const handleEditAnswer = (answerId: string, content: string) => {
    navigate(`/answer/update/${answerId}`);
  };

  const handleDeleteAnswer = async (answerId: string) => {
    const url = `${process.env.REACT_APP_API_SERVER}/answers/${answerId}`;
    try {
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("답변이 성공적으로 삭제되었습니다.");
      handleSelectedQuesId();
    } catch (error) {
      console.error("에러 :", error);
    }
  };

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
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <section className="questionDetailpage_wrapper">
      <article className="closed_container1" key={questionData?.questionId}>
        <div className="closed_header">
          <h1 className="headerTitle">문제 해결</h1>
          <button
            className="closed_askQBtn"
            onClick={() => navigate(`/question/create`)}
          >
            질문 하기
          </button>
        </div>
        <div className="question_container">
          <div className="question_section1">
            {questionData?.questionTitle}
            {questionData?.answerList.length !== 0 ? "[해결]" : ""}
          </div>
          <div className="question_section2">
            <div className="section2_1">
              <div className="questionStats statsList">
                {userDetail.rep}평 {/* Display vote count */}
              </div>
              <div className="questionStats statsList">
                {/* {questionData?.answerList} 답변 */}
              </div>
              <div className="questionStats statsList">
                {questionData?.viewCount} 열람
              </div>
            </div>
            <div className="section2_2">
              <div className="profileStats statsList">
                <img
                  src="https://picsum.photos/200/300?grayscale"
                  alt=""
                  style={{ width: "20px", height: "20px", borderRadius: "50%" }}
                />
              </div>
              <div className="profileStats statsList">
                {questionData?.author.memberName}
                <span className="viewCountSpan">{questionData?.viewCount}</span>
              </div>
              <div className="profileStats statsList">
                {questionData?.createdAt.toString().split("T").join(" ")}
              </div>
            </div>
          </div>
          <div className="question_section3">
            <div className="section3_sideBar">
              <button
                className="answerBtn answer_likeBtn"
                onClick={handleVoteIncrement}
                disabled={
                  userData?.name === questionData?.author.memberName ||
                  voteCount >= 1
                }
              >
                ▲
              </button>
              <div>{voteCount}</div>
              <button
                className="answerBtn answer_disLikeBtn"
                onClick={handleVoteDecrement}
                disabled={
                  userData?.name === questionData?.author.memberName ||
                  voteCount <= 0
                }
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
                {questionData?.answerList.length !== 0 ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: "hsl(148, 70%, 31%)" }}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="section3_content">
              <div className="tagList">{questionData?.tagNameList}</div>
              <div
                className="section3_body"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              ></div>
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
        <h1 className="subTitle">{questionData?.answerCount} 답변</h1>
      </article>
      {/* 답변 리스트 map */}
      {questionData?.answerList.map((answer) => (
        <AnswerItem
          key={answer.answerId}
          answer={answer}
          refreshAnswers={refreshAnswers}
        />
      ))}
      <article className="closed_container4">
        {/* 사용자가 이미 답변을 작성했을 경우 입력 비활성화 */}
        {!hasUserAnswered && (
          <AnswerCreate questionId={questionData?.questionId} />
        )}
      </article>
    </section>
  );
}
