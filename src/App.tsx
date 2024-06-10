import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/UserAuth/LoginPage";
import RegisterPage from "./components/UserAuth/RegisterPage";
import FindPasswordPage from "./components/UserAuth/FindPasswordPage";
import "./styles/index.scss";
import "./styles/userAuth.scss";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import Mypage from "./components/Mypage/Mypage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/findPassword" element={<FindPasswordPage />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
