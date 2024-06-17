import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import cancel from "../../assets/cancel.png";
interface Passwords {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ModifyPasswordProps {
  handleUserDataChange: (name: string, value: string) => void;
  currentPw: string;
  onHide: () => void;
}

const ModifyPassword: React.FC<ModifyPasswordProps> = ({
  handleUserDataChange,
  currentPw,
  onHide,
}) => {
  const [passwords, setPasswords] = useState<Passwords>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMatchMessage, setPasswordMatchMessage] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const handleCheckPassword = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPasswords({
      ...passwords,
      confirmPassword: value,
    });

    if (value !== passwords.newPassword) {
      setPasswordMatchMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMatchMessage("비밀번호가 일치합니다.");
    }
  };

  const handleSaveChanges = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const url = `${process.env.REACT_APP_API_SERVER}/member/auth/password`;

      const data = {
        pwd: passwords.currentPassword,
        changePwd: passwords.newPassword,
      };

      const response = await axios.patch(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const { result, msg } = response.data;
      if (result) {
        handleUserDataChange("password", passwords.newPassword);
        onHide();
        alert(msg);
      } else {
        alert("비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("비밀번호 업데이트 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="modal-content">
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="currentPassword">
            <h3>현재 비밀번호</h3>
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">
            <h3>새 비밀번호</h3>
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">
            <h3>비밀번호 확인</h3>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleCheckPassword}
          />
        </div>
      </div>
      <div className="check">{passwordMatchMessage}</div>
      <div className="form-btns">
        <button onClick={handleSaveChanges} className="save-btn">
          변경사항 저장
        </button>
        <button className="hide" onClick={onHide}>
          <img src={cancel} alt="" />
        </button>
      </div>
    </div>
  );
};

export default ModifyPassword;
