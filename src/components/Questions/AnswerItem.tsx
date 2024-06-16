import { AnswerDetail } from "../../types/question";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useInfoStore } from "../../store";
import authStore from "../../store/authStore";
import { useState, useMemo, useRef } from "react";
import axios from "axios";

import ReactQuillModule from "./ReactQuillModule";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "../../styles/index.scss";

interface AnswerItemProps {
  answer: AnswerDetail;
  refreshAnswers: () => Promise<void>;
}

export default function AnswerItem({
  answer,
  refreshAnswers,
}: AnswerItemProps) {
  const { authToken } = authStore();
  const userData = useInfoStore((state) => state.userInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(answer.answerContent);
  const QuillRef = useRef<ReactQuill>();
  const [voteCount, setVoteCount] = useState<number>(0);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(answer.answerContent);
  };

  // 수정된 것 저장
  const handleSaveEdit = async () => {
    const url = `${process.env.REACT_APP_API_SERVER}/questions/answers/${answer.answerId}`;
    try {
      await axios.patch(
        url,
        { answerContent: editedContent },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setIsEditing(false);
      refreshAnswers(); // 부모 컴포넌트에서 답변 목록을 다시 불러오는 함수 호출
    } catch (error) {
      console.error("Error updating answer:", error);
    }
  };

  const handleDelete = async () => {
    const url = `${process.env.REACT_APP_API_SERVER}/questions/answers/${answer.answerId}`;
    try {
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      refreshAnswers(); // 부모 컴포넌트에서 답변 목록을 다시 불러오는 함수 호출
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

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

  // 투표
  const handleVoteIncrement = async () => {
    const url = `${process.env.REACT_APP_API_SERVER}/votes/answer/${answer?.answerId}?voteState=true`;
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
    const url = `${process.env.REACT_APP_API_SERVER}/votes/answer/${answer?.answerId}?voteState=false`;
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

  return (
    <div className="closed_container3" key={answer.answerId}>
      <div className="section3_1">
        <button
          className="answerBtn answer_likeBtn"
          onClick={handleVoteIncrement}
        >
          ▲
        </button>
        <div>{voteCount}</div>
        <button
          className="answerBtn answer_disLikeBtn"
          onClick={handleVoteDecrement}
        >
          ▼
        </button>
        <div className="resolve_bookMark answer_bookMark">🕮</div>
      </div>
      <div className="section3_2">
        <div className="part3_1">
          <div className="area1">
            <div className="profileStats statsList">
              <img
                src="https://picsum.photos/200/300?grayscale"
                alt=""
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                }}
              />
            </div>
            <div className="profileStats statsList">
              {answer.author.memberName} 님
            </div>
          </div>
          <div className="area2">
            <div className="profileStats statsList">
              {new Date(answer.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="answerItem">
          <div className="part3_2">
            {isEditing ? (
              <>
                <div id="toolBar">
                  <ReactQuillModule />
                </div>
                <ReactQuill
                  ref={(element) => {
                    if (element !== null) {
                      QuillRef.current = element;
                    }
                  }}
                  value={editedContent}
                  onChange={setEditedContent}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                  placeholder="수정할 내용을 입력해주세요."
                />
              </>
            ) : (
              <div
                className="section4_body"
                dangerouslySetInnerHTML={{ __html: answer.answerContent }}
              />
            )}
          </div>
          <div className="answer_actions">
            {userData?.idx === answer.author.memberIdx && (
              <>
                {isEditing ? (
                  <>
                    <button onClick={handleSaveEdit} className="saveBtn">
                      저장
                    </button>
                    <button onClick={handleCancelEdit} className="cancelBtn">
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleEdit} className="editBtn">
                      수정
                    </button>
                    <button onClick={handleDelete} className="deleteBtn">
                      삭제
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
