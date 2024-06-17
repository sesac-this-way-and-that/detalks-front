import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import cancel from "../../assets/cancel.png";
import { useInfoStore } from "../../store";
import authStore from "../../store/authStore";

interface WithdrawUserProps {
  onHide: () => void;
}

const WithdrawUser: React.FC<WithdrawUserProps> = ({ onHide }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const userData = useInfoStore((state) => state.userInfo);
  const removeToken = authStore((state) => state.removeAuthToken);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 회원 탈퇴 요청 전 확인 메시지 출력
    const confirmMessage = userData?.isDeleted
      ? "정말로 회원 복구를 진행하시겠습니까?"
      : "정말로 회원 탈퇴를 진행하시겠습니까?";

    const confirm = window.confirm(confirmMessage);
    if (!confirm) return;

    try {
      const token = localStorage.getItem("authToken");
      const url =
        userData?.social == "NONE" || userData?.isDeleted
          ? `${process.env.REACT_APP_API_SERVER}/member/auth`
          : `${process.env.REACT_APP_API_SERVER}/member/auth/social`;
      const method = userData?.isDeleted ? "post" : "delete";

      const data = {
        pwd: password,
        reason: reason,
      };

      const response = await axios.request({
        method: method,
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: data,
      });

      if (response.data.result) {
        if (userData?.isDeleted) {
          alert("회원 복구가 완료되었습니다.");
          window.location.href = "/mypage/" + userData.idx;
        } else {
          removeToken();
          alert("회원 탈퇴가 완료되었습니다.");
          window.location.href = "/";
        }
      } else {
        alert(response.data.msg);
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response Error:", error.response.data);
        alert(`Failed to process withdrawal: ${error.response.data.message}`);
      } else {
        alert("Failed to process withdrawal");
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
      <p className={userData?.isDeleted ? "recover-title" : "title"}>
        {userData?.isDeleted
          ? "정말로 회원 복구를 하시겠습니까?"
          : "정말로 회원 탈퇴를 하시겠습니까?"}
      </p>
      <p className="middletitle">
        {userData?.isDeleted ? "" : "30일 동안 정보를 유지한 뒤 삭제됩니다."}
      </p>
      <p className="smalltitle">
        {userData?.isDeleted
          ? "회원 정보를 복구 하시겠습니까?"
          : "회원 탈퇴를 위해 비밀번호와 탈퇴 사유를 입력해주세요."}
      </p>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {!userData?.isDeleted && (
            <>
              {userData?.social == "NONE" && (
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
              )}
            </>
          )}
          {!userData?.isDeleted && (
            <div className="form-group">
              <label htmlFor="reason">사유</label>
              <input
                type="text"
                id="reason"
                value={reason}
                onChange={handleReasonChange}
              />
            </div>
          )}
          <button
            type="submit"
            className={userData?.isDeleted ? "recover-btn" : "withdraw-btn"}
          >
            {userData?.isDeleted ? "회원 복구" : "회원 탈퇴"}
          </button>
        </form>
      </div>
      <button className="hide" onClick={onHide}>
        <img src={cancel} alt="닫기" />
      </button>
    </div>
  );
};

export default WithdrawUser;
