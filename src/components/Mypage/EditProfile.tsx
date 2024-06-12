import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [imageUrl, setImageUrl] = useState<string>("default.jpg");
  const [name, setName] = useState(userInfo.name);
  const [summary, setSummary] = useState(userInfo.summary);
  const [about, setAbout] = useState(userInfo.about);

  useEffect(() => {
    setName(userInfo.name);
    setSummary(userInfo.summary);
    setAbout(userInfo.about);
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
      const token = localStorage.getItem("authToken"); // Assuming you store your token in localStorage

      const url = `${process.env.REACT_APP_API_SERVER}/member/auth`;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("summary", summary);
      formData.append("about", about);

      if (selectedFile) {
        formData.append("img", selectedFile);
      } else {
        formData.append("img", imageUrl); // Append default image URL if no file is selected
      }

      console.log("FormData Entries:");
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await axios.patch(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data); // Log the response

      onUserInfoChange({ name, summary, about });
      if (selectedFile) {
        onProfileImageChange(URL.createObjectURL(selectedFile));
      }
      alert("Profile updated successfully");
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
