import { useState, useEffect, useRef, useMemo } from "react";
import authStore from "../../store/authStore";
import axios from "axios";
import { AnswerDetail, QuestionDetail } from "../../types/question";
import { useInfoStore } from "../../store";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactQuillModule from "./ReactQuillModule";
import dompurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "../../styles/answerCreate.scss";

interface AnswerProps {
  questionId: string | undefined;
}

export default function AnswerCreate({ questionId }: AnswerProps) {
  const { authToken } = authStore();
  const QuillRef = useRef<ReactQuill>();
  const [contents, setContents] = useState("");

  // editor 설정
  const formats: string[] = [
    "header",
    "size",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "background",
    "align",
    "script",
    "code-block",
    "clean",
  ];
  hljs.configure({
    languages: ["javascript", "ruby", "python", "java", "cpp", "kotlin", "sql"],
  });
  const modules: {} = useMemo(
    () => ({
      toolbar: {
        container: "#toolBar",
      },
      syntax: {
        highlight: (text: string) => hljs.highlightAuto(text).value,
      },
    }),
    []
  );

  // 답변 제출
  const handleSubmit = async () => {
    // e.preventDefault();

    if (!authToken) {
      alert("답변을 제출하려면 로그인이 필요합니다.");
      return;
    }

    const url = `${process.env.REACT_APP_API_SERVER}/questions/${questionId}/answers`;
    const data = {
      answerContent: contents,
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("답변 제출:", response.data);
      setContents("");
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
          <div id="toolBar">
            <ReactQuillModule />
          </div>
          <ReactQuill
            ref={(element) => {
              if (element !== null) {
                QuillRef.current = element;
              }
            }}
            value={contents}
            onChange={setContents}
            modules={modules}
            formats={formats}
            theme="snow"
            placeholder="내용을 입력해주세요."
          />
        </div>
      </div>
      <div className="closedBtn_container">
        <button type="submit" className="answerSubmitBtn" onClick={handleSubmit}>
          답변 제출
        </button>
      </div>
      {/* {!!answerData && !isEditMode && (
        <p>이미 이 질문에 대한 답변을 제출하셨습니다.</p>
      )} */}
    </div>
  );
}
