import { AnswerDetail } from "../../types/question";

interface AnswerItemProps {
  answer: AnswerDetail;
  userMemberIdx: number | null;
  onEdit: (answerId: string, content: string) => void;
  onDelete: (answerId: string) => void;
}

export default function AnswerItem({
  answer,
  userMemberIdx,
  onEdit,
  onDelete,
}: AnswerItemProps) {
  const isAuthor = userMemberIdx === answer.author.memberIdx;

  return (
    <div className="closed_container3" key={answer.answerId}>
      <div className="section3_1">
        <button className="answerBtn answer_likeBtn">▲</button>
        <div>{answer.voteCount}</div>
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
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                }}
              />
            </div>
            <div className="profileStats statsList">
              {answer.author.memberName} <span>{answer.author.memberIdx}</span>
            </div>
          </div>
          <div className="area2">
            <div className="profileStats statsList">
              {new Date(answer.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="part3_2">
          <div className="section4_body">{answer.answerContent}</div>
        </div>
        {isAuthor && (
          <div className="answer-actions">
            <button
              onClick={() => onEdit(answer.answerId, answer.answerContent)}
            >
              수정
            </button>
            <button onClick={() => onDelete(answer.answerId)}>삭제</button>
          </div>
        )}
      </div>
    </div>
  );
}
