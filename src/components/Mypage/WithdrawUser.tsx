import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface WithdrawUserProps {
  onHide: () => void;
}

const WithdrawUser: React.FC<WithdrawUserProps> = ({ onHide }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     if (!userId || !password) return alert("아이디와 비밀번호를 입력해주세요.");

  //     const confirm = window.confirm("정말로 회원탈퇴를 진행하시겠습니까?");
  //     if (!confirm) return;

  //     const res = await axios({
  //         method: "delete",
  //         url: `${process.env.REACT_APP_API_SERVER}/api/withdrawal`,
  //         data: { id: userId, password },
  //     });

  //     if (res.data.success) {
  //         alert("회원탈퇴가 완료되었습니다.");
  //         isLogin();
  //         navigate("/");
  //     } else {
  //         alert(res.data);
  //     }
  // };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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
      <p>30일 까지 정보를 유지한 뒤 삭제됩니다.</p>
      <div className="mypage-profile-container">
        <p className="mypage-smalltitle">
          회원탈퇴를 위해 비밀번호를 입력해주세요.
        </p>
        <form>
          {/* onSubmit={handleSubmit}> */}
          <div>
            <label htmlFor="password">비밀번호:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="withdraw-btn">
            회원 탈퇴
          </button>
        </form>
      </div>
      <button className="hide" onClick={onHide}>
        X
      </button>
    </div>
  );
};

export default WithdrawUser;
