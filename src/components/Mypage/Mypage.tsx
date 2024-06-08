import { useState } from "react";
import EditProfile from "./EditProfile";
import MyPosts from "./MyPosts";
import Profile from "./Profile";

const Mypage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [userInfo, setUserInfo] = useState({
    name: "이기혁",
    summary: "안녕하세요. 프론트엔드를 하고 있는 개발자입니다.",
    about: "안녕하세요. 프론트엔드를 하고 있는 개발자입니다.\n\n...",
  });
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleUserInfoChange = (newUserInfo: typeof userInfo) => {
    setUserInfo(newUserInfo);
  };

  const handleProfileImageChange = (imageUrl: string) => {
    setProfileImageUrl(imageUrl);
  };

  return (
    <section>
      <h2>마이페이지</h2>
      <article>
        <div>
          <img src={profileImageUrl} alt="프로필 사진" />
        </div>
        <div>
          <p>
            <span>{userInfo.name}</span> 님
          </p>
          <p>{userInfo.summary}</p>
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
          {activeTab === "profile" && <Profile userInfo={userInfo} />}
          {activeTab === "mypost" && <MyPosts />}
          {activeTab === "editprofile" && (
            <EditProfile
              userInfo={userInfo}
              onUserInfoChange={handleUserInfoChange}
              onProfileImageChange={handleProfileImageChange}
            />
          )}
        </div>
      </article>
    </section>
  );
};

export default Mypage;
