import { useState } from "react";
import { AccountForm } from "./userInterface";
import accountStore from "../../store/userStore";
import axios from "axios";

export default function NameInput({ accessType }: AccountForm) {
  const [nameMsg, setNameMsg] = useState<string>("");
  const { setName } = accountStore();

  // 이름 유효성 검사
  const namePattern = /^[ㄱ-ㅎ가-힣a-z0-9-_]{2,10}$/;
  const nameValidation = (name: string) => {
    if (namePattern.test(name) === false) {
      return false;
    } else {
      return true;
    }
  };

  const nameDuplCheck = async (name: string) => {
    const response = await axios
      .get(`${process.env.REACT_APP_API_SERVER}/member/name/${name}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err.response.status === 400) {
          return { msg: "이미 사용 중인 이름입니다." };
        }
      });
    setNameMsg(response.msg);
  };

  const nameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length >= 2 && e.target.value.length <= 10) {
      if (!nameValidation(e.target.value)) {
        setNameMsg("이름은 한글, 영문자, 숫자, -, _ 만 사용 가능합니다.");
      } else {
        nameDuplCheck(e.target.value);
      }
    } else {
      setNameMsg("이름은 2자 이상 10자 이하로 입력해야 합니다.");
    }
    setName(e.target.value);
  };
  return (
    <>
      <label>
        <p>이름</p>
        <input type="text" required onChange={nameOnChange} name="name" />
        <div>
          <span id="nameInputMsg">{nameMsg}</span>
        </div>
      </label>
    </>
  );
}
