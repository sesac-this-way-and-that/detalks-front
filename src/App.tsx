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
import QuestionCreateAndModifyPage from "./components/Questions/QuestionCreateAndModifyPage";
import QuestionListPage from "./components/Questions/QuestionListPage";
import QuestionDetailPage from "./components/Questions/QuestionDetailPage";
import SocialAccount from "./components/UserAuth/SocialAccount";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/oauth2/google/redirect/header"
          element={<GoogleAccount />}
        />

        <Route path="/findPassword" element={<FindPassword />} />
        <Route path="/mypage/:userId" element={<Mypage />} />
        <Route path="/user/:userId" element={<Mypage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/questions" element={<QuestionListPage />} />
        <Route path="/question/:questionId" element={<QuestionDetailPage />} />
        <Route
          path="/question/create"
          element={<QuestionCreateAndModifyPage />}
        />
        <Route
          path="/question/update/:questionId"
          element={<QuestionCreateAndModifyPage />}
        />
        {/* <Route
          path="/question/create/:questionId"
          element={<Question type="create" />}
        /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
