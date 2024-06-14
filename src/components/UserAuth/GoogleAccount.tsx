import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authStore from "../../store/authStore";

export default function GoogleAccount() {
  // 소셜로그인 유저가 사용하는 컴포넌트
  // 해당 컴포넌트 렌더링 시 쿠키에 저장된 토큰을 백단으로 리다이렉트해서 헤더로 받아오도록 하려는 목적
  const nav = useNavigate();
  const { authToken, setAuthToken, removeAuthToken } = authStore();
  useEffect(() => {
    redirectHandler();
  }, []);

  const redirectHandler = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_SERVER}/member/auth/header`, {
        withCredentials: true,
      })
      .then((res) => {
        localStorage.setItem("authToken", res.data.token);
        setAuthToken(localStorage.getItem("authToken"));
        console.log(JSON.stringify(res.data));
        nav("/");
      })
      .catch((err) => alert(err));
  };

  return <div></div>;
}
