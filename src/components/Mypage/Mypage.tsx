import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditProfile from "./EditProfile";
import MyPosts from "./MyPosts";
import Profile from "./Profile";
import { useInfoStore } from "../../store";

const Mypage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");

  const { userId } = useParams<{ userId: string }>();
  const userData = useInfoStore((state) => state.userInfo);
  const loggedInUserId = userData?.idx; // Replace with the actual logged-in user's ID
  const getInfo = useInfoStore((state) => state.getInfo);
  const [userInfo, setUserInfo] = useState({
    idx: userData?.idx || 0,
    name: userData?.name || "default-name",
    summary: userData?.summary || "한 줄 소개가 없습니다.",
    about: userData?.about || "자기소개가 없습니다.",
    img: userData?.img || "default.jpg",
    qcount: userData?.qcount || 0,
    acount: userData?.acount || 0,
    rep: userData?.rep || 0,
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleUserInfoChange = (newUserInfo: typeof userInfo) => {
    setUserInfo(newUserInfo);
  };

  const handleProfileImageChange = (imageUrl: string) => {
    setProfileImageUrl(imageUrl);
  };

  const isCurrentUser = userId == loggedInUserId;
  // console.log(isCurrentUser + userId + loggedInUserId);
  console.log(userData);
  useEffect(() => {
    if (isCurrentUser) {
      getInfo();
    } else {
      console.log("하하");
      axios
        .get(`${process.env.REACT_APP_API_SERVER}/member/${userId}`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          setUserInfo({
            idx: data.idx,
            name: data.name || "default-name",
            summary: data.summary || "한 줄 소개가 없습니다.",
            about: data.about || "자기소개가 없습니다.",
            img: data.img || "default.jpg",
            qcount: data?.qcount || 0,
            acount: data?.acount || 0,
            rep: data?.rep || 0,
          });
        });
    }
  }, [userId, getInfo, isCurrentUser]);
  // useEffect(() => {
  //   getInfo();
  // }, [userData]);
  return (
    <section>
      <h2 className="title">마이페이지</h2>
      <article className="mypage-profile">
        <div className="profile-img">
          <img
            src={process.env.REACT_APP_STATIC_SERVER + "/" + userInfo.img}
            alt={userInfo.img}
          />
        </div>
        <div className="profile-content">
          <p className="profile-name">
            <span>{userInfo.name}</span> 님
          </p>
          <p className="profile-summary">{userInfo.summary}</p>
          <div className="profile-tag">
            <span>java</span>
            <span>javascript</span>
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
          {isCurrentUser && (
            <button
              className={activeTab === "editprofile" ? "active" : ""}
              onClick={() => handleTabChange("editprofile")}
            >
              정보수정
            </button>
          )}
          <div className="line"></div>
        </div>

        <div className="mypage-components-container">
          {activeTab === "profile" && <Profile userInfo={userInfo} />}
          {activeTab === "mypost" && <MyPosts />}
          {activeTab === "editprofile" && isCurrentUser && (
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
