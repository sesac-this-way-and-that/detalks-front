import { useEffect, useState } from "react";
import "../../styles/discussionPage.scss";
import axios from "axios";
import { DiscussionInformation } from "../../types/discussion";
import { Link, useNavigate } from "react-router-dom";

export default function Discussion() {
  const navigate = useNavigate();
  // const DEFAULT_DISCUSSIONINFO: DiscussionInformation = {
  //   answerList: [],
  //   author: {
  //     memberIdx: 0,
  //     memberName: "",
  //   },
  //   bookmarkState: false,
  //   createdAt: new Date(),
  //   isSolved: false,
  //   modifiedAt: new Date(),
  //   questionContent: "",
  //   questionId: 0,
  //   questionState: false,
  //   questionTitle: "",
  //   tagNameList: [],
  //   viewCount: 0,
  //   voteCount: 0,
  // };

  const [discussionList, setDiscussionList] = useState<DiscussionInformation[]>(
    []
  );

  const handleIinformation = async () => {
    const url = `${process.env.REACT_APP_API_SERVER}/questions`;
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDiscussionList(response.data.data.content);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    handleIinformation();
  }, []);
  console.log(discussionList);
  return (
    <section className="discussion_wrapper">
      <article className="discussion_container_1">
        <h1 className="title">질의 응답</h1>
        <div className="subfilter_sort_box">
          <div className="flex_item item1">100 질문</div>
          <ul className="flex_item item2">
            <li className="itemList">최신순</li>
            <li className="itemList">평점순</li>
            <li className="itemList">답변없는 질의</li>
          </ul>
        </div>
      </article>
      {discussionList.map((discussion, idx) => {
        return (
          <article
            className="discussion_container_2"
            key={discussion.questionId}
          >
            <ul className="post_summary_stats">
              <li className="statsList">{discussion.voteCount} 평점</li>
              <li className="statsList">1 답변</li>
              <li className="statsList">{discussion.viewCount} 열람</li>
            </ul>
            <div className="post_content_area">
              <div className="post_title">{discussion.questionTitle}</div>

              <div
                className="post_content"
                onClick={() => {
                  navigate(`/closed/${discussion.questionId}`);
                }}
              >
                {discussion.questionContent}
              </div>

              <div className="post_footer">
                <div className="post_lang">
                  <div className="lang_type">{discussion.tagNameList}</div>
                </div>
                <div className="post_userDetails">
                  <div className="post_image">
                    <img
                      className="post_userImg"
                      src="https://picsum.photos/200/300?grayscale"
                      alt=""
                    />
                  </div>
                  <div className="post_userIno">
                    {discussion.author.memberName}
                    <span>{discussion.viewCount}</span>
                  </div>
                  <div className="post_createdAt">
                    {discussion.createdAt.toString()}
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
