import { Route, Routes } from "react-router-dom";
import "./styles/index.scss";
import Main from "./components/Main";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
