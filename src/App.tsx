import { Route, Routes } from "react-router-dom";
import "./styles/index.scss";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import Mypage from "./components/Mypage/Mypage";
import LoginPage from "./components/UserAuth/LoginPage";
import RegisterPage from "./components/UserAuth/RegisterPage";
import FindPassword from "./components/UserAuth/FindPasswordPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GoogleAccount from "./components/UserAuth/GoogleAccount";
import Board from "./components/Board/Board";
import Discussion from "./components/Discussion/Discussion";

function App() {
  return (
    <>
      <Header></Header>
      <Routes>
        {/* /board */}
        {/* /board/1 */}
        {/* /board/modify/사용자id&질문id */}
        {/* /board/create/사용자id */}
        {/* /mypage */}
        {/* /user/사용자id */}
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/oauth2/google/redirect/header"
          element={<GoogleAccount />}
        />
        <Route path="/findPassword" element={<FindPassword />} />
        <Route path="/board" element={<Discussion />} />
        <Route path="/board/:userId" element={<Board />} />
        <Route path="/board/modify/:userId/:postId" element={<Board />} />
        <Route path="/board/create/:userId" element={<Board />} />
        <Route path="/mypage/:userId" element={<Mypage />} />
        <Route path="/user/:userId" element={<Mypage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;
