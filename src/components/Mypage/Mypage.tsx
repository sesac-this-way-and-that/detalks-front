import { useState, useEffect } from "react";
import EditProfile from "./EditProfile";
import MyPosts from "./MyPosts";
import Profile from "./Profile";
import { useInfoStore } from "../../store";
const Mypage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");

  const userData = useInfoStore((state) => state.userInfo);
  const getInfo = useInfoStore((state) => state.getInfo);
  const [userInfo, setUserInfo] = useState({
    name: userData?.name || "default-name",
    summary: userData?.summary || "한 줄 소개가 없습니다.",
    about: userData?.about || "자기소개가 없습니다.",
  });

  // getInfo();
  // console.log("gkgk" + userData);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleUserInfoChange = (newUserInfo: typeof userInfo) => {
    setUserInfo(newUserInfo);
  };

  const handleProfileImageChange = (imageUrl: string) => {
    setProfileImageUrl(imageUrl);
  };

  useEffect(() => {
    // Call getInfo whenever userInfo changes
    getInfo();
  }, [userInfo, getInfo]);

  return (
    <section>
      <h2 className="title">마이페이지</h2>
      <article className="mypage-profile">
        <div className="profile-img">
          <img src={profileImageUrl} alt="프로필 사진" />
        </div>
        <div className="profile-content">
          <p className="profile-name">
            <span>{userInfo.name}</span> 님
          </p>
          <p className="profile-summary">{userInfo.summary}</p>
          <div className="profile-tag">
            <span>java</span>
            <span>javascript </span>
          </div>
        </div>
      </article>
      <article className="mypage-tab">
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
          <div className="line"></div>
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
