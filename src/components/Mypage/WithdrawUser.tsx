import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import cancel from "../../assets/cancel.png";
import { useInfoStore } from "../../store";
interface WithdrawUserProps {
  onHide: () => void;
}

const WithdrawUser: React.FC<WithdrawUserProps> = ({ onHide }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const userData = useInfoStore((state) => state.userInfo);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password) {
      return alert("비밀번호를 입력해주세요.");
    }

    const confirm = window.confirm("정말로 회원탈퇴를 진행하시겠습니까?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("authToken");
      const url = `${process.env.REACT_APP_API_SERVER}/member/auth`;
      console.log(token);
      const formData = new URLSearchParams();
      formData.append("pwd", password);
      formData.append("reason", reason);

      const response = await axios.request({
        method: "delete",
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: formData.toString(),
      });

      if (response.data.result) {
        alert("회원탈퇴가 완료되었습니다.");
        navigate("/");
      } else {
        alert(response.data.msg);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response Error:", error.response.data);
        alert(`Failed to delete account: ${error.response.data.message}`);
      } else {
        alert("Failed to delete account");
      }
    }
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
        onHide();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen, onHide]);

  return (
    <div ref={modalRef} className="modal-content">
      <p className="title">정말로 탈퇴하시겠습니까?</p>
      <p className="middletitle">30일 까지 정보를 유지한 뒤 삭제됩니다.</p>
      <p className="smalltitle">
        회원탈퇴를 위해 비밀번호와 탈퇴 사유를 입력해주세요.
      </p>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {userData?.social == "NONE" ? (
            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="current-password"
              />
            </div>
          ) : (
            <></>
          )}
          <div className="form-group">
            <label htmlFor="reason">탈퇴 사유</label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={handleReasonChange}
            />
          </div>
          <button type="submit" className="withdraw-btn">
            회원 탈퇴
          </button>
        </form>
      </div>
      <button className="hide" onClick={onHide}>
        <img src={cancel} alt="" />
      </button>
    </div>
  );
};

export default WithdrawUser;
