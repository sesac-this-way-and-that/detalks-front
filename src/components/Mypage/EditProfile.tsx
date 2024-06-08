import React, { useState } from "react";
import ModifyPassword from "./ModifyPassword";
import WithdrawUser from "./WithdrawUser";

interface EditProfileProps {
  userInfo: {
    name: string;
    summary: string;
    about: string;
  };

  onUserInfoChange: (newUserInfo: {
    name: string;
    summary: string;
    about: string;
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
  const [imageUrl, setImageUrl] = useState<string>("");
  const [name, setName] = useState(userInfo.name);
  const [summary, setSummary] = useState(userInfo.summary);
  const [about, setAbout] = useState(userInfo.about);
  const handleProfileImageChange = (imageUrl: string) => {
    onProfileImageChange(imageUrl);
  };
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onUserInfoChange({ name, summary, about });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  return (
    <div>
      <div>
        <h3>프로필 사진 수정</h3>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imageUrl && (
          <div>
            <img src={imageUrl} alt="프로필 사진" style={{ width: "200px" }} />
          </div>
        )}
      </div>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">닉네임</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="summary">한 줄 소개</label>
          <input
            type="text"
            id="summary"
            name="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="about">자기소개</label>
          <textarea
            id="about"
            name="about"
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="">비밀번호 수정</label>
          <button type="button" onClick={handleOpenPasswordModal}>
            비밀번호 수정하기
          </button>
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-button">
            내 정보 수정
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleOpenWithdrawModal}
          >
            회원 탈퇴
          </button>
        </div>
      </form>
      {isPasswordModalOpen && (
        <div className="modal">
          <ModifyPassword
            handleUserDataChange={() => {}}
            currentPw=""
            onHide={handleClosePasswordModal}
          />
        </div>
      )}
      {isWithdrawModalOpen && (
        <div className="modal">
          <WithdrawUser onHide={handleCloseWithdrawModal} />
        </div>
      )}
    </div>
  );
};

export default EditProfile;
