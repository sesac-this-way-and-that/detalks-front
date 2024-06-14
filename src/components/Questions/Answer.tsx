import { useState, useEffect, useRef } from "react";
import authStore from "../../store/authStore";
import axios from "axios";

interface AnswerProps {
  questionId: string;
  existingAnswer: boolean;
}

export default function Answer({ questionId, existingAnswer }: AnswerProps) {
  const { authToken } = authStore();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaInputValue, setTextAreaInputValue] = useState<string>("");
  const [formattedText, setFormattedText] = useState<string>("");
  const [submitDisabled, setSubmitDisabled] = useState(existingAnswer);

  // 이미 작성한 답변 존재 시, disabled
  useEffect(() => {
    setSubmitDisabled(existingAnswer);
  }, [existingAnswer]);

  // text editor
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

    // 텍스트 입력 시, 하이라이팅
    setFormattedText(formatTextToHTML(textAreaInputValue));
  }, [textAreaInputValue]);

  // 답변 제출 버튼
  const handleSubmit = async () => {
    if (!authToken) {
      alert("답변을 제출하려면 로그인이 필요합니다.");
      return;
    }

    // axios 연결
    const url = `${process.env.REACT_APP_API_SERVER}/questions/${questionId}/answers`;
    const data = {
      //   questionId: questionId,
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
      alert("답변 제출에 성공했습니다!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios 에러:", error.message);
      } else {
        console.error("예상치 못한 에러:", error);
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
            disabled={submitDisabled}
          />
          <div
            className="here"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        </div>
      </div>
      {!submitDisabled && (
        <div className="closedBtn_container">
          <button
            className="closedBtn"
            onClick={handleSubmit}
            disabled={!textAreaInputValue}
          >
            답변 제출
          </button>
        </div>
      )}
      {submitDisabled && <p>이미 이 질문에 대한 답변을 제출하셨습니다.</p>}
    </div>
  );
}
