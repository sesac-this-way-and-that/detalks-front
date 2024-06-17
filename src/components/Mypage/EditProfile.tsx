import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ModifyPassword from "./ModifyPassword";
import WithdrawUser from "./WithdrawUser";
import { useInfoStore } from "../../store";
import authStore from "../../store/authStore";

interface EditProfileProps {
  userInfo: {
    idx: number;
    name: string;
    summary: string;
    about: string;
    qcount: number;
    acount: number;
    rep: number;
    img: string;
  };
  onUserInfoChange: (newUserInfo: {
    idx: number;
    name: string;
    summary: string;
    about: string;
    qcount: number;
    acount: number;
    rep: number;
    img: string;
  }) => void;
  onProfileImageChange: (imageUrl: string) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({
  userInfo,
  onUserInfoChange,
  onProfileImageChange,
}) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(userInfo.img);
  const [name, setName] = useState(userInfo.name);
  const [summary, setSummary] = useState(userInfo.summary);
  const [about, setAbout] = useState(userInfo.about);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const getInfo = useInfoStore((state) => state.getInfo);
  const userData = useInfoStore((state) => state.userInfo);
  const getToken = authStore((state) => state.authToken);

  useEffect(() => {
    setName(userInfo.name);
    setSummary(userInfo.summary);
    setAbout(userInfo.about);
    setImageUrl(process.env.REACT_APP_STATIC_SERVER + "/" + userInfo.img);
  }, [userInfo]);

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleOpenWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
  };

  const handleCloseWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = getToken;

      const url1 = `${process.env.REACT_APP_API_SERVER}/member/auth`;
      const url2 = `${process.env.REACT_APP_API_SERVER}/member/auth/profile`;

      const data = {
        name,
        summary,
        about,
      };

      const formData = new FormData();

      if (selectedFile) {
        formData.append("img", selectedFile);
      }

      const response1 = await axios.patch(url1, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      
      const response2 = await axios.patch(url2, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response1.data);
      console.log(response2.data);

      onUserInfoChange({
        idx: userInfo.idx,
        name,
        summary,
        about,
        qcount: userInfo.qcount,
        acount: userInfo.acount,
        rep: userInfo.rep,
        img: imageUrl,
      });
      if (selectedFile) {
        onProfileImageChange(URL.createObjectURL(selectedFile));
      }
      alert("회원님의 정보가 정상적으로 수정되었습니다.");
      getInfo();
      window.location.href = `/mypage/${userInfo.idx}`;
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error) && error.response) {
        // Handle specific error response from server
        console.error("Response Error:", error.response.data);
        alert(`Failed to update profile: ${error.response.data.message}`);
      } else {
        alert("Failed to update profile");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
          onProfileImageChange(reader.result); // Update the profile image URL
        }
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="edit-profile">
      <div className="edit-profile-img">
        <h3>프로필 사진 수정</h3>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {userInfo.img && (
          <div onClick={handleImageClick} className="profile-img">
            <img
              // src={process.env.REACT_APP_STATIC_SERVER + "/" + userInfo.img}
              src={imageUrl}
              alt={imageUrl}
              style={{ width: "180px", cursor: "pointer" }}
            />
          </div>
        )}
      </div>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <h3>
            <label htmlFor="name">닉네임</label>
          </h3>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <h3>
            <label htmlFor="summary">한 줄 소개</label>
          </h3>
          <input
            type="text"
            id="summary"
            name="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div className="form-group">
          <h3>
            <label htmlFor="about">자기소개</label>
          </h3>
          <textarea
            id="about"
            name="about"
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
        {userData?.social == "NONE" ? (
          <div className="form-group">
            <h3>
              <label htmlFor="">비밀번호 수정</label>
            </h3>
            <button
              type="button"
              onClick={handleOpenPasswordModal}
              className="modify-pwd-btn"
            >
              비밀번호 수정하기
            </button>
          </div>
        ) : (
          <></>
        )}

        <div className="form-btns">
          <button type="submit" className="submit-btn">
            내 정보 수정
          </button>
          <button
            type="button"
            className={userData?.isDeleted ? "recover-btn" : "cancel-btn"}
            onClick={handleOpenWithdrawModal}
          >
            {userData?.isDeleted ? "회원 복구" : "회원 탈퇴"}
          </button>
        </div>
      </form>
      {isPasswordModalOpen && (
        <>
          <div className="modal">
            <ModifyPassword
              handleUserDataChange={() => {}}
              currentPw=""
              onHide={handleClosePasswordModal}
            />
          </div>
          <div className="modal-backdrop"></div>
        </>
      )}
      {isWithdrawModalOpen && (
        <>
          <div className="modal">
            <WithdrawUser onHide={handleCloseWithdrawModal} />
          </div>
          <div className="modal-backdrop"></div>
        </>
      )}
    </div>
  );
};

export default EditProfile;
