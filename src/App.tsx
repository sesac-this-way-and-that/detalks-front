import { Route, Routes } from "react-router-dom";
import "./styles/index.scss";
import "./styles/userAuth.scss";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import Mypage from "./components/Mypage/Mypage";
import LoginPage from "./components/UserAuth/LoginPage";
import RegisterPage from "./components/UserAuth/RegisterPage";
import FindPassword from "./components/UserAuth/FindPasswordPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GoogleAccount from "./components/UserAuth/GoogleAccount";

function App() {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/oauth2/google/redirect/header"
          element={<GoogleAccount />}
        />
        <Route path="/findPassword" element={<FindPassword />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;
