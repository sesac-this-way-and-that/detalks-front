import { SyntheticEvent, useEffect, useRef, useState } from "react";
import "../../styles/questionDetailPage.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import { QuestionDetail } from "../../types/question";
import authStore from "../../store/authStore";

export default function QuestionDetailPage() {
  const { authToken } = authStore();

  const { questionId } = useParams<{ questionId: string }>();
  const [questionData, setQuestionData] = useState<QuestionDetail>();

  const [formattedText, setFormattedText] = useState<string>("");
  const [textAreaInputValue, setTextAreaInputValue] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
      console.log("API Response:", response.data);
      setQuestionData(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    handleSelectedQuesId();
  }, []);
  console.log("questionData: ", questionData);

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

  return (
    <section>
      <article className="closed_container1" key={questionData?.questionId}>
        <div className="closed_header">
          <h1 className="headerTitle">문제 해결</h1>
          <button className="closed_askQBtn">질문 하기</button>
        </div>
        <div className="question_container">
          <div className="question_section1">{questionData?.questionTitle}</div>
          <div className="question_section2">
            <div className="section2_1">
              <div className="questionStats statsList">
                {questionData?.voteCount}평
              </div>
              <div className="questionStats statsList">
                {questionData?.answerList} 답변
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
                {questionData?.author.memberName}{" "}
                <span>{questionData?.viewCount}</span>
              </div>
              <div className="profileStats statsList">
                {questionData?.createdAt.toString()}
              </div>
            </div>
          </div>
          <div className="question_section3">
            <div className="section3_sideBar">
              <button className="answerBtn answer_likeBtn">▲</button>
              <div>{questionData?.voteCount}</div>
              <button className="answerBtn answer_disLikeBtn">▼</button>
              <div className="resolve_bookMark">🕮</div>
            </div>
            <div
              className="section3_body"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            ></div>
          </div>
          <div className="question_section4">
            <div className="section_text">수정</div>
            <div className="section_text">삭제</div>
          </div>
        </div>
      </article>
      <article className="closed_container2">
        <h1 className="subTitle">1 답변</h1>
      </article>
      <article className="closed_container3">
        <div className="section3_1">
          <button className="answerBtn answer_likeBtn">▲</button>
          <div>8</div>
          <button className="answerBtn answer_disLikeBtn">▼</button>
          <div className="resolve_bookMark answer_bookMark">🕮</div>
        </div>
        <div className="section3_2">
          <div className="part3_1">
            <div className="area1">
              <div className="profileStats statsList">
                <img
                  src="https://picsum.photos/200/300?grayscale"
                  alt=""
                  style={{ width: "20px", height: "20px", borderRadius: "50%" }}
                />
              </div>
              <div className="profileStats statsList">
                이기혁님 <span>485</span>
              </div>
            </div>
            <div className="area2">
              <div className="profileStats statsList">2024-06-04 16:09:30</div>
            </div>
          </div>
          <div className="part3_2">
            <div className="section4_body">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
              qui tempora nisi vero nobis minima illum. Ducimus minima beatae
              doloribus culpa officiis! Corrupti, asperiores! Voluptate quas
              atque ratione eum voluptas.
            </div>
          </div>
        </div>
      </article>
      <article className="closed_container4">
        <h1 className="subTitle">내 답변</h1>
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
        <div className="closedBtn_container">
          <button className="closedBtn">답변 하기</button>
        </div>
      </article>
    </section>
  );
}
