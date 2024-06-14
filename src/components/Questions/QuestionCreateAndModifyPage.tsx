import "../../styles/questionCreateAndModifyPage.scss";
import React, { useState, useRef, useEffect, SyntheticEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import authStore from "../../store/authStore";

export default function QuestionCreateAndModifyPage() {
  const navigate = useNavigate();
  const { authToken } = authStore();
  const [textAreaInputValue, setTextAreaInputValue] = useState<string>("");
  const [formattedText, setFormattedText] = useState<string>("");
  const [tagInptValue, setTagInputValue] = useState<string>("");
  const [tagOutputvalue, setTagOutputValue] = useState<string[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [applicationContent, setApplicationContent] = useState<string>("");
  const [attemptContent, setAttemptContent] = useState("");

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

  const attemptHandleContentChange = (
    event: React.ChangeEvent<HTMLDivElement>
  ) => {
    setAttemptContent(event.target.innerText);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_SERVER}/questions`;
    // if (!url || !token) {
    //   alert("Please fill out all fields before submitting.");
    //   return;
    // }

    const questionData = {
      questionTitle: applicationContent,
      questionContent: textAreaInputValue,
      tagNames: tagOutputvalue,
      // tagNames: tagInptValue
      //   .split(",")
      //   .map((tag) => tag.trim())
      //   .filter((tag) => tag),
    };

    try {
      const response = await axios.post(url, questionData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("response: ", response.data);
      setApplicationContent("");
      setTextAreaInputValue("");
      setTagInputValue("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <section className="application_wrapper">
      <h1 className="headerTitle">질문을 작성해주세요</h1>
      <article className="application_container1">
        <div className="subTitle_container">
          <h1 className="subTitle">제목</h1>
          <h6 className="descriptionTitle">
            구체적으로 말씀하시고 다른 사람에게 질문을 한다고 생각해 보세요.
          </h6>
          <div className="subTitle_input">
            <input
              id="title"
              type="text"
              placeholder="제목을 작성해주세요."
              value={applicationContent}
              onChange={(e) => setApplicationContent(e.target.value)}
            />
          </div>
        </div>
        {/* <div className="applicationForm_container">
          <h1 className="subTitle">문제의 세부 사항은 무엇입니까?</h1>
          <h6 className="descriptionTitle">
            문제를 제목에 넣은 내용과 연관지어 작성해주세요.(단 최소 20자)
          </h6>
        </div> */}
        <div className="attempt_container">
          <h1 className="subTitle">무엇을 시도하셨고 무엇을 기대하셨습니까?</h1>
          <h6 className="descriptionTitle">
            무엇을 시도했는지. 무엇이 일어날 것이라고 예상했는지. 그리고 실제로
            어떤 결과가 나타났는지 설명하세요.(단 최소 20자)
          </h6>
          <div className="richEditorText_container">
            <div>
              <textarea
                ref={textAreaRef}
                value={textAreaInputValue}
                onChange={(e) => setTextAreaInputValue(e.target.value)}
                style={{ width: "100%", height: "200px" }}
              />
              <div
                className="here"
                dangerouslySetInnerHTML={{ __html: formattedText }}
              />
            </div>
          </div>
        </div>
        <div className="tag_container">
          <h1 className="subTitle">태그를 작성해주세요.</h1>
          <div className="tag_input">
            <input
              type="text"
              placeholder="예) JAVA"
              value={tagInptValue}
              onChange={(e) => setTagInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (tagInptValue.trim()) {
                    setTagOutputValue((prevTags) => [
                      ...prevTags,
                      tagInptValue.trim(),
                    ]);
                    setTagInputValue("");
                  }
                }
              }}
            />
          </div>
          <div className="application_footer">
            {tagOutputvalue.map((tag, i) => {
              return (
                <div className="application_lang" key={i}>
                  <div className="application_lang_type">{tag}</div>
                  <div
                    className="xBtnForTag"
                    onClick={() => {
                      setTagOutputValue((prevTags) => {
                        const updatedTags = [...prevTags];
                        updatedTags.splice(i, 1);
                        return updatedTags;
                      });
                    }}
                  >
                    &times;
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </article>
      <article className="application_container2">
        <div className="applicationBtn_container">
          <button
            className="appBtn"
            onClick={(e) => {
              handleSubmit(e);
              navigate(`/questions`);
            }}
          >
            질문 등록하기
          </button>
        </div>
      </article>
    </section>
  );
}
