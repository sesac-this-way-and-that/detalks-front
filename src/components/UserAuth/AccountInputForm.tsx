import axios from "axios";
import EmailInput from "./EmailInput";
import NameInput from "./NameInput";
import PwdInput from "./PwdInput";
import { AccountForm } from "./userInterface";
import accountStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";

export default function AccountInputForm({
  accessType,
  accessText,
}: AccountForm) {
  const { email, name, pwd } = accountStore();
  const nav = useNavigate();
  const submitFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (accessType === "register") {
      const url = `${process.env.REACT_APP_API_SERVER}/member/signup`;
      const userData = {
        email: email,
        name: name,
        pwd: pwd,
      };
      console.log("userdata: ", userData);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("pwd", pwd);
      // const response =
      axios
        .post(url, formData)
        .then((res) => {
          alert("회원가입 성공");
          console.log("then res.data: ", res.data);
          nav("/login");
        })
        .catch((err) => {
          // alert(err.data.msg);
          console.log("err: ", err);
        });
      // console.log("response: ", response);
    } else if (accessType === "login") {
      const url = `${process.env.REACT_APP_API_SERVER}/member/signin`;
      const userData = {
        email: email,
        pwd: pwd,
      };
      console.log("userdata: ", userData);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("pwd", pwd);
      axios
        .post(url, formData)
        .then((res) => {
          console.log("then res.data: ", res.data);
          localStorage.setItem("authToken", res.data.token);
          alert("로그인 성공");
          // nav("/main");
        })
        .catch((err) => {
          console.log("err: ", err);
          alert("로그인 실패");
        });
    } else if (accessType === "findPw") {
      alert("패스워드 찾기");
    }
  };
  /* const submitRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_SERVER}/member/signup`;
    const userData = {
      email: email,
      name: name,
      pwd: pwd,
    };
    console.log("userdata: ", userData);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("pwd", pwd);
    // const response =
    axios
      .post(url, formData)
      .then((res) => {
        alert("회원가입 성공");
        console.log("then res.data: ", res.data);
        nav("/login");
      })
      .catch((err) => {
        // alert(err.data.msg);
        console.log("err: ", err);
      });
    // console.log("response: ", response);
  };

  const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_SERVER}/member/signin`;
    const userData = {
      email: email,
      pwd: pwd,
    };
    console.log("userdata: ", userData);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("pwd", pwd);
    const response = await axios
      .post(url, formData)
      .then((res) => {
        console.log("then res.data: ", res.data);
        localStorage.setItem("loginToken", res.data.token);
        alert("로그인 성공");
        // nav("/main");
      })
      .catch((err) => {
        console.log("err: ", err);
        alert("로그인 실패");
      });
    console.log("response: ", response);
  }; */

  return (
    <article className="accountInputForm">
      <div className="pageType">
        <div className="logo"></div>
        <p>{accessText}</p>
      </div>
      <form
        // onSubmit={accessType === "register" ? submitRegister : submitLogin}
        onSubmit={submitFunc}
        className="inputContainer"
      >
        <EmailInput accessType={accessType} />
        {accessType === "register" ? (
          <NameInput accessType={accessType} />
        ) : null}
        {accessType === "register" || accessType === "login" ? (
          <PwdInput accessType={accessType} />
        ) : null}
        <button type="submit">{accessText}</button>
      </form>
      {/* <div className="inputContainer">
        <EmailInput accessType={accessType} />
        {accessType === "register" ? (
          <NameInput accessType={accessType} />
        ) : null}
        {accessType === "register" || accessType === "login" ? (
          <PwdInput accessType={accessType} />
        ) : null}
        <button onClick={accessForm}>{accessText}</button>
      </div> */}
    </article>
  );
}
