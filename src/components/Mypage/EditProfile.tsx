import React from "react";

const EditProfile: React.FC = () => {
  return (
    <div>
      <div>
        <h3>프로필 사진 수정</h3>
        <div className="profile-picture-section">
          <img src="" alt="프로필 사진" className="profile-picture" />
        </div>
      </div>
      <form className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            defaultValue="이기혁"
          />
        </div>
        <div className="form-group">
          <label htmlFor="introduction">한 줄 소개</label>
          <input
            type="text"
            id="introduction"
            name="introduction"
            defaultValue="안녕하세요. 프론트엔드를 하고 있는 개발자입니다."
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">자기소개</label>
          <textarea
            id="bio"
            name="bio"
            rows={5}
            defaultValue={`안녕하세요. 프론트엔드를 하고 있는 개발자입니다.\n\n...`}
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-button">
            내 정보 수정
          </button>
          <button type="button" className="cancel-button">
            회원 탈퇴
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
