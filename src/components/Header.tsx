import "../styles/header.scss";


export default function Header() {
    return <div className="headerWrapper">
    <div className="headerLogoContainer">
      <a href="#">
        <img
          className="headerLogo"
          src="https://picsum.photos/seed/picsum/200/300"
          alt=""
          style={{width: "100px", height: "50px"}}
        />
      </a>
    </div>
    <div className="headerNavigation">
      <input type="checkbox" className="toggle-menu" />
      <div className="hamburger"></div>

      <ul className="headerMenu">
        <li><a href="">질의응답</a></li>
        <li>
          <div className="searchInput">
            <input type="text" /><button>검색</button>
          </div>
        </li>
        <li><a href="">로그인</a></li>
        <li><a href="">회원가입</a></li>
      </ul>
    </div>
  </div>
}
