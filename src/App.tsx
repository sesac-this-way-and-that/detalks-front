import { Route, Routes } from "react-router-dom";
import "./styles/index.scss";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import Mypage from "./components/Mypage/Mypage";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;
