import { useState, useEffect, useRef } from "react";
import authStore from "../../store/authStore";
import axios from "axios";
// import { jwtDecode } from "jwt-decode"; // jwt-decode import 추가
import { AnswerDetail, QuestionDetail } from "../../types/question";

interface AnswerProps {
  questionId: string;
  answerList: AnswerDetail[] | undefined;
  userMemberIdx: number | null;
  onEdit: (answerId: string, content: string) => void;
  onDelete: (answerId: string) => void;
  answerInputDisabled: boolean;
}

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

export default function AnswerCreate({
  questionId,
  answerList,
  userMemberIdx,
  onEdit,
  onDelete,
  answerInputDisabled,
}: AnswerProps) {
  const { authToken } = authStore();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaInputValue, setTextAreaInputValue] = useState<string>("");
  const [formattedText, setFormattedText] = useState<string>("");

  useEffect(() => {
    // 텍스트 입력 시 하이라이팅
    setFormattedText(formatTextToHTML(textAreaInputValue));
  }, [textAreaInputValue]);

  // 답변 제출
  const handleSubmit = async () => {
    if (!authToken) {
      alert("답변을 제출하려면 로그인이 필요합니다.");
      return;
    }

    const url = `${process.env.REACT_APP_API_SERVER}/questions/${questionId}/answers`;
    const data = {
      answerContent: textAreaInputValue,
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("답변 제출:", response.data);
      setTextAreaInputValue("");
      alert("답변이 성공적으로 작성되었습니다.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios 에러:", error.message);
      } else {
        console.error("답변 작성 에러:", error);
      }
    }
  };

  return (
    <div className="answer-container">
      <h1 className="subTitle">내 답변</h1>
      <div className="richEditorText_container">
        <div>
          <textarea
            ref={textAreaRef}
            value={textAreaInputValue}
            onChange={(e) => setTextAreaInputValue(e.target.value)}
            style={{ width: "100%", height: "200px" }}
            disabled={answerInputDisabled}
          />
          <div
            className="here"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        </div>
      </div>
      {!answerInputDisabled && (
        <button onClick={handleSubmit}>답변 제출</button>
      )}
      {/* {!!answerData && !isEditMode && (
        <p>이미 이 질문에 대한 답변을 제출하셨습니다.</p>
      )} */}
    </div>
  );
}
