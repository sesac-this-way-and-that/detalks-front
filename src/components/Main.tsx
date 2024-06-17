import { useEffect, useRef } from "react";
import { useInfoStore } from "../store";
import Header from "./Header";
import { Link } from "react-router-dom";
import questions from "../assets/questions.png";
import questionDetail from "../assets/questionDetail.png";
import mypage from "../assets/mypage.png";

export default function Main() {
  const userData = useInfoStore((state) => state.userInfo);

  useEffect(() => {
    const mainImgs = document.querySelectorAll(".main-img");

    mainImgs.forEach((mainImg) => {
      const img = mainImg.querySelector("img");
      if (img) {
        mainImg.addEventListener("mouseover", () => {
          const main = mainImg as HTMLElement;
          const imgHeight = img.offsetHeight;
          const mainImgHeight = main.offsetHeight;
          img.style.transform = `translateY(-${imgHeight - mainImgHeight}px)`;
        });
        mainImg.addEventListener("mouseout", () => {
          img.style.transform = "translateY(0)";
        });
      }
    });
  }, []);

  const containerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // 요소가 50% 이상 보일 때 감지
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLDivElement;
          target.classList.add("visible"); // 진입하면 클래스 추가
        }
      });
    }, options);

    containerRefs.current.forEach((containerRef) => {
      if (containerRef) {
        observer.observe(containerRef);
      }
    });

    return () => {
      observer.disconnect(); // 컴포넌트가 언마운트될 때 옵저버 해제
    };
  }, []);

  return (
    <section className="main-section">
      <article className="main-container-wave">
        <div className="wave-box">
          <div className="wave one"></div>
          <div className="wave two"></div>
          <div className="wave three"></div>
          <div className="wave four"></div>
          <div className="wave five"></div>
          <div className="wave six"></div>
          <div className="wave seven"></div>
          <div className="wave eight"></div>
          <div className="wave nine"></div>
          <div className="wave ten"></div>
          <div className="wave eleven"></div>
          <div className="wave twelve"></div>
          <div className="wave thirteen"></div>
          <div className="wave fourteen"></div>
          <div className="wave sixteen"></div>
          <div className="wave seventeen"></div>
        </div>

        <div className="main-container first">
          <div>
            <p>개발자들의 코딩 커뮤니티</p>
            <p>"DEBUG TALKS"</p>
            <p>Detalks와 함께 문제를 해결해봐요.</p>
          </div>
        </div>
      </article>
      <article>
        <div
          ref={(el) => (containerRefs.current[0] = el)}
          className="main-container contents"
        >
          <div className="main-img">
            <img src={questions} alt="" />
          </div>
          <div className="main-content">
            <p>"다른 사람들은 어떻게 해결했을까?"</p>
            <p>여러 개발자들과 실시간 토론</p>
            <p>
              여러 개발자들이 어려워하던 문제들을 실시간으로 질문을 올리고
              답변하여 개발자들이 쉽고 빠르게 문제를 해결할 수 있습니다.
            </p>
            <p>
              <button>
                <Link to={"/questions"}>질의응답 페이지 보기</Link>
              </button>
            </p>
          </div>
        </div>
      </article>
      <article>
        <div
          ref={(el) => (containerRefs.current[1] = el)}
          className="main-container contents"
        >
          <div className="main-content">
            <p>"아무리 찾아도 제가 필요한 부분이 없어요."</p>
            <p>직접 모르는 문제 공유 가능</p>
            <p>
              해결하지 못한 문제를 직접 질문해보세요. 여러 개발자들과 함께
              얘기해보며 질문과 답변에 대해 좋았거나 별로이면 직접 평점을 부과할
              수 있어 다음에 보기에도 편한 '디버그 톡스' '디버그 톡스'와 문제를
              해결해 봐요.
            </p>
          </div>
          <div className="main-img">
            <img src={questionDetail} alt="" />
          </div>
        </div>
      </article>
      <article>
        <div
          ref={(el) => (containerRefs.current[2] = el)}
          className="main-container contents"
        >
          <div className="main-img">
            <img src={mypage} alt="" />
          </div>
          <div className="main-content">
            <p>"전에 궁금했던거 다시 보고 싶어요."</p>
            <p>마이페이지에서 내 글 확인 가능</p>
            <p>
              내 활동 내역들과 채택여부, 평점들을 확인 가능해 여러분들이 열심히
              한 활동들 다시 확인 가능해요.
            </p>
            <p>
              <Link to={"/mypage/" + userData?.idx}>
                <button>마이페이지 보기</button>
              </Link>
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
