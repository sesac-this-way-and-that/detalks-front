import React, { useEffect, useState } from "react";
import axios from "axios";
import { useInfoStore } from "../../store";
import { Link, useParams } from "react-router-dom";

interface ProfileProps {
  userInfo: {
    name: string;
    summary: string;
    about: string;
    qcount: number;
    acount: number;
    rep: number;
    img: string;
  };
}

interface Question {
  id: number;
  titleOrContent: string;
  isQuestion: boolean;
  createdAt: string;
  voteCount: number;
  questionId: number;
  isSolved: boolean;
  isSelected: boolean;
}

const Profile: React.FC<ProfileProps> = ({ userInfo }) => {
  const [topQuestions, setTopQuestions] = useState<Question[]>([]);
  const userData = useInfoStore((state) => state.userInfo);
  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    let apiUrl;
    if (userData?.idx) {
      apiUrl = `${process.env.REACT_APP_API_SERVER}/mypage/${userData?.idx}/activities/top-votes`;
    } else {
      apiUrl = `${process.env.REACT_APP_API_SERVER}/mypage/${userId}/activities/top-votes`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        const { data } = response.data;
        setTopQuestions(data.slice(0, 5));
      })
      .catch((error) => {
        console.error("API 호출 중 오류 발생:", error);
      });
  }, [userData?.idx]);

  const getDisplayName = (name: string) => {
    return name.length > 20 ? name.slice(0, 20) + "..." : name;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <>
      <div className="mypage-profile-container">
        <div className="mypage-profile-ability">
          <h3>나의 능력치</h3>
          <div className="box">
            <div className="box1">
              <div>
                <p>{userInfo.rep}</p>
                <p>평가</p>
              </div>
              <div>
                <p>{userData?.bookmarkCount ? userData?.bookmarkCount : 0}</p>
                <p>북마크</p>
              </div>
            </div>
            <div className="box2">
              <div>
                <p>{userInfo.qcount}</p>
                <p>질문</p>
              </div>
              <div>
                <p>{userInfo.acount}</p>
                <p>답변</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mypage-profile-about">
          <h3>자기소개</h3>
          <div className="box">
            <p>{userInfo.about}</p>
          </div>
        </div>
      </div>
      <div className="mypage-profile-top">
        <h3>Top 5</h3>
        <div className="box">
          {topQuestions.length > 0 ? (
            <>
              {topQuestions.map((question) => (
                <Link to={`/question/${question.questionId}`} key={question.id}>
                  <ul>
                    <li>
                      {question.isQuestion ? (
                        <span className={question.isSolved ? "is-solved" : ""}>
                          Q
                        </span>
                      ) : (
                        <span
                          className={question.isSelected ? "is-selected" : ""}
                        >
                          A
                        </span>
                      )}
                    </li>
                    <li>
                      {question.isQuestion ? (
                        <span
                          className={question.isSolved ? "is-solved-vote" : ""}
                        >
                          {question.voteCount} 투표
                        </span>
                      ) : (
                        <span
                          className={
                            question.isSelected ? "is-selected-vote" : ""
                          }
                        >
                          {question.voteCount} 투표
                        </span>
                      )}
                    </li>
                    <li>
                      <span>
                        {getDisplayName(question.titleOrContent || "")}
                      </span>
                    </li>
                    <li>{formatDate(question.createdAt)}</li>
                  </ul>
                </Link>
              ))}
            </>
          ) : (
            <ul>
              <li></li>
              <li></li>
              <li>
                <span>작성하신 질문이 없습니다.</span>
              </li>
              <li></li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
