import "../styles/header.scss";
import {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPen } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useInfoStore } from "../store";
import authStore from "../store/authStore";
import logo from "../assets/logo.png";

interface UserInfo {
  idx: number;
  name: string;
  img: string;
}

export default function Header(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const userData = useInfoStore((state) => state.userInfo) as UserInfo | null;
  const getInfo = useInfoStore((state) => state.getInfo);
  const removeToken = authStore((state) => state.removeAuthToken);
  const getToken = authStore((state) => state.authToken);
  const nav = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLUListElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const prevLocation = window.location.href;

  useEffect(() => {
    const token = getToken;
    if (token) {
      getInfo();
      setIsAuthenticated(true);
    }
  }, [getInfo, getToken]);

  const handleLogout = () => {
    let newLocation = prevLocation;
    if (prevLocation.includes("mypage")) {
      newLocation = prevLocation.replace("mypage", "user");
    }
    removeToken();
    setIsAuthenticated(false);
    window.location.href = newLocation;
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    let searchParams: Record<string, any> = {
      sortBy: "voteCount",
      page: 0,
      size: 10,
    };

    if (searchQuery.startsWith("[tag]:")) {
      searchParams = {
        ...searchParams,
        tag: searchQuery.replace("[tag]:", "").trim(),
      };
    } else if (searchQuery.startsWith("[title]:")) {
      searchParams = {
        ...searchParams,
        title: searchQuery.replace("[title]:", "").trim(),
      };
    } else if (searchQuery.startsWith("[content]:")) {
      searchParams = {
        ...searchParams,
        content: searchQuery.replace("[content]:", "").trim(),
      };
    } else if (searchQuery.startsWith("[name]:")) {
      searchParams = {
        ...searchParams,
        name: searchQuery.replace("[name]:", "").trim(),
      };
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/questions/search`,
        {
          params: searchParams,
        }
      );
      console.log("Search Results:", response.data);
      nav("/questions", { state: { searchResults: response.data.data } });
      setIsFocused(false);
      setSearchQuery("");
    } catch (error) {
      nav("/questions", { state: { searchResults: false } });
      // console.error("Search Error:", error);
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleExampleClick = (example: string) => {
    setSearchQuery(example);
    setIsFocused(false);
  };

  const getDisplayName = (name: string) => {
    return name.length > 5 ? name.slice(0, 5) + "..." : name;
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 100);
  };

  const handleSidebarToggle = () => {
    const checkbox = document.querySelector<HTMLInputElement>(".toggle-menu");
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // console.log(sidebarRef);
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        const checkbox =
          document.querySelector<HTMLInputElement>(".toggle-menu");
        // console.log(checkbox);
        if (checkbox) {
          checkbox.checked = false;
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkbox = document.querySelector<HTMLInputElement>(".toggle-menu");
    if (checkbox) {
      checkbox.checked = false;
    }
  }, [location]);

  return (
    <section className="headerWrapper">
      <div className="headerContainer container">
        <div className="headerLogoContainer">
          <Link to="/">
            <img className="headerLogo" src={logo} alt="Logo" />
            <p>Detalks</p>
          </Link>
        </div>
        <div className="headerNavigation">
          <input type="checkbox" className="toggle-menu" />
          <div className="hamburger" onClick={handleSidebarToggle}></div>

          <form className="searchInput" onSubmit={handleFormSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onClick={() => setIsFocused(true)}
              onBlur={handleBlur}
              onKeyDown={handleInputKeyDown} // Listen for Enter key press
            />
            <button type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>
          {isFocused && (
            <div
              className="searchTooltip"
              onMouseDown={(e) => e.preventDefault()}
            >
              <p>검색어 예시</p>
              <p onClick={() => handleExampleClick("[title]: ")}>
                [title]: title - 제목별 검색
              </p>
              <p onClick={() => handleExampleClick("[name]: ")}>
                [name]: username - 사용자 이름별 검색
              </p>
              <p onClick={() => handleExampleClick("[content]: ")}>
                [content]: content - 내용별 검색
              </p>
              <p onClick={() => handleExampleClick("[tag]: ")}>
                [tag]: java - 태그별 검색
              </p>
            </div>
          )}
          <ul className="headerMenu" ref={sidebarRef}>
            {getToken ? (
              <li className="myname-mobile">
                <Link to={`/mypage/${userData?.idx}`}>
                  <div className="profile-img">
                    <img
                      src={`${process.env.REACT_APP_STATIC_SERVER}/${userData?.img}`}
                      alt={`${process.env.REACT_APP_STATIC_SERVER}/${userData?.img}`}
                    />
                  </div>
                  <span>{getDisplayName(userData?.name || "")} 님</span>
                </Link>
              </li>
            ) : (
              <></>
            )}
            <li>
              <Link to="/questions">질의응답</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="myname">
                  <Link to={`/mypage/${userData?.idx}`}>
                    <div className="profile-img">
                      <img
                        src={`${process.env.REACT_APP_STATIC_SERVER}/${userData?.img}`}
                        alt={`${process.env.REACT_APP_STATIC_SERVER}/${userData?.img}`}
                      />
                    </div>
                    <span>{getDisplayName(userData?.name || "")}</span> 님
                  </Link>
                </li>
                <li>
                  <a href="#" onClick={handleLogout}>
                    로그아웃
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">로그인</Link>
                </li>
                <li>
                  <Link to="/register">회원가입</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <button
        className={`${
          getToken && window.location.pathname !== "/question/create"
            ? "qna-write-question"
            : "qna-write-question-none"
        }`}
        onClick={() => nav(`/question/create`)}
      >
        <FontAwesomeIcon icon={faPen} />
      </button>
    </section>
  );
}
