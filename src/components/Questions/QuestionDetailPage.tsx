import { SyntheticEvent, useEffect, useRef, useState } from "react";
import "../../styles/questionDetailPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { QuestionDetail, AnswerDetail } from "../../types/question";
import authStore from "../../store/authStore";
import { jwtDecode } from "jwt-decode"; // jwt-decode import 추가
import AnswerCreate from "./AnswerCreate";
import AnswerItem from "./AnswerItem";
import { useInfoStore } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faFlag } from "@fortawesome/free-solid-svg-icons";

export default function QuestionDetailPage() {
  const { authToken } = authStore();
  const { questionId } = useParams<{ questionId?: string }>();
  const navigate = useNavigate();
  const userData = useInfoStore((state) => state.userInfo);


  const [questionData, setQuestionData] = useState<QuestionDetail | null>(null);
  const [userMemberIdx, setUserMemberIdx] = useState<number | null>(null);
  const [answerInputDisabled, setAnswerInputDisabled] =
    useState<boolean>(false);
  const { questionId } = useParams<{ questionId: string }>();
  const [voteCount, setVoteCount] = useState<number>(-1);


  const [formattedText, setFormattedText] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaInputValue, setTextAreaInputValue] = useState<string>("");

  useEffect(() => {
    // 사용자 토큰에서 멤버 인덱스 추출
    const getUserMemberIdx = (authToken: string): number | null => {
      try {
        const decodedToken: any = jwtDecode(authToken);
        const memberIdx = decodedToken.idx;
        return memberIdx;
      } catch (error) {
        console.error("토큰 디코딩 에러:", error);
        return null;
      }
    };

    // authToken이 존재할 때만 사용자 멤버 인덱스 설정
    if (authToken) {
      setUserMemberIdx(getUserMemberIdx(authToken));
      console.log("member idx ~~~~~~ ", setUserMemberIdx);
    }
  }, [authToken]);

  const [isBookMarked, setIsBookMarked] = useState<boolean>(false);

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

  // 코드 블럭
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

  // 질문 조회
  useEffect(() => {
    const handleSelectedQuesId = async () => {
      if (!questionId) return;

      const url = `${process.env.REACT_APP_API_SERVER}/questions/${questionId}`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log("API Response:", response.data);
        setQuestionData(response.data.data);
        checkIfUserAnswered(response.data.data.answerList);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    handleSelectedQuesId(); // 초기 렌더링 시 한 번 호출
  }, [questionId, authToken]);
  console.log("questionData: ", questionData);

  // 사용자가 이미 답변을 작성했는지 확인
  const checkIfUserAnswered = (answerList: AnswerDetail[]) => {
    if (!userMemberIdx || !answerList) return;

    const userAnswer = answerList.find(
      (answer) => answer.author.memberIdx === userMemberIdx
    );
    if (userAnswer) {
      setAnswerInputDisabled(true);
    } else {
      setAnswerInputDisabled(false);
    }
  };

  // 답변 수정 처리
  const handleEdit = async (answerId: string, content: string) => {
    if (!authToken) {
      alert("로그인 후 답변을 수정할 수 있습니다.");
      return;
    }

    const url = `${process.env.REACT_APP_API_SERVER}/questions/answers/${answerId}`;
    const data = {
      answerContent: content,
    };

    try {
      const response = await axios.patch(url, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("답변 수정:", response.data);
      alert("답변이 성공적으로 수정되었습니다.");

      // 수정된 답변을 questionData에 반영
      if (questionData) {
        const updatedAnswerList = questionData.answerList.map((answer) =>
          answer.answerId === answerId
            ? { ...answer, answerContent: content }
            : answer
        );
        setQuestionData({
          ...questionData,
          answerList: updatedAnswerList,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios 에러:", error.message);
      } else {
        console.error("예상치 못한 에러:", error);
      }
    }
  };

  // 답변 삭제 처리
  const handleDelete = async (answerId: string) => {
    if (!window.confirm("정말로 이 답변을 삭제하시겠습니까?")) {
      return;
    }

      console.log("API Response:", response.data);
      setQuestionData(response.data.data);
      console.log(
        "response.data.data.voteCount: ",
        response.data.data.voteCount
      );
      setVoteCount(response.data.data.voteCount);
      console.log(
        "response.data.data.bookmarkState: ",
        response.data.data.bookmarkState
      );
      setIsBookMarked(response.data.data.bookmarkState);
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
      navigate("/questions"); // Redirect to the homepage or any other page after deletion
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };


    const url = `${process.env.REACT_APP_API_SERVER}/questions/answers/${answerId}`;

    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("답변 삭제:", response.data);
      alert("답변이 성공적으로 삭제되었습니다.");

      // 답변 삭제 후 질문 데이터 업데이트
      if (questionData) {
        const updatedAnswerList = questionData.answerList.filter(
          (answer) => answer.answerId !== answerId
        );
        setQuestionData({
          ...questionData,
          answerList: updatedAnswerList,
        });
      }
    } catch (error) {
      console.error("답변 삭제 에러:", error);
    }
  };

  useEffect(() => {
    handleSelectedQuesId();
  }, []);

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

  return (
    <section>
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
          <div className="question_section1">{questionData?.questionTitle}</div>
          <div className="question_section2">
            <div className="section2_1">
              <div className="questionStats statsList">
                {voteCount}평 {/* Display vote count */}
              </div>
              <div className="questionStats statsList">
                {questionData?.answerCount} 답변
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
                <span>{questionData?.viewCount}</span>
              </div>
              <div className="profileStats statsList">
                {questionData?.createdAt.toString()}
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
              <div>{Math.max(voteCount, 0)}</div>
              <button
                className="answerBtn answer_disLikeBtn"
                onClick={handleVoteDecrement}
                disabled={userData?.name === questionData?.author.memberName}
              >
                ▼
              </button>
              <div className="resolve_bookMark" onClick={toggleBookmark}>
                {isBookMarked ? (
                  <FontAwesomeIcon icon={faFlag} />
                ) : (
                  <FontAwesomeIcon icon={faBookmark} />
                )}
              </div>
            </div>
            <div
              className="section3_body"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            ></div>
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
      {/* 답변 */}
      <article className="closed_container2">
        <h1 className="subTitle">{questionData?.answerCount} 답변</h1>
        {/* 답변 리스트 map */}
        {questionData?.answerList.map((answer) => (
          <AnswerItem
            key={answer.answerId}
            answer={answer}
            userMemberIdx={userMemberIdx}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </article>

      <article className="closed_container4">
        <div>
          {/* 사용자가 이미 답변을 작성했을 경우 입력 비활성화 */}
          {questionId ? (
            <AnswerCreate
              questionId={questionId}
              answerList={questionData?.answerList}
              userMemberIdx={userMemberIdx}
              onEdit={handleEdit}
              onDelete={handleDelete}
              answerInputDisabled={answerInputDisabled}
            />
          ) : null}
        </div>
      </article>
    </section>
  );
}
