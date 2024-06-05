import { useState } from "react";
import EditProfile from "./EditProfile";
import MyPosts from "./MyPosts";
import Profile from "./Profile";

const Mypage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <section>
      <h2>마이페이지</h2>
      <article>
        <div>
          <img src="" alt="" />
        </div>
        <div>
          <p>
            <span>이기혁</span> 님
          </p>
          <p>안녕하세요. 프론트엔드를 하고 있는 개발자입니다.</p>
          <div>
            <span>
              <p>java</p>
            </span>
            <span>
              <p>javascript</p>
            </span>
          </div>
        </div>
      </article>
      <article>
        <div className="mypage-button-container">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => handleTabChange("profile")}
          >
            프로필
          </button>
          <button
            className={activeTab === "mypost" ? "active" : ""}
            onClick={() => handleTabChange("mypost")}
          >
            내 활동
          </button>
          <button
            className={activeTab === "editprofile" ? "active" : ""}
            onClick={() => handleTabChange("editprofile")}
          >
            정보수정
          </button>
        </div>

        <div className="mypage-components-container">
          {activeTab === "profile" && <Profile />}
          {activeTab === "mypost" && <MyPosts />}
          {activeTab === "editprofile" && <EditProfile />}
        </div>
      </article>
    </section>
  );
};

export default Mypage;
