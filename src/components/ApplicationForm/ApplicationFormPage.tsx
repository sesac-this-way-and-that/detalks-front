import "../../styles/applicationFormPage.scss";
import { SyntheticEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faSuperscript,
  faSubscript,
  faListOl,
  faList,
  faRotateLeft,
  faRotateRight,
  faLink,
  faUnlink,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faIndent,
  faOutdent,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

export default function ApplicationFormPage() {
  const [applicationContent, setApplicationContent] = useState("");
  const [attemptContent, setAttemptContent] = useState("");

  const applicationHandleContentChange = (
    event: React.ChangeEvent<HTMLDivElement>
  ) => {
    setApplicationContent(event.target.innerText);
  };
  const attemptHandleContentChange = (
    event: React.ChangeEvent<HTMLDivElement>
  ) => {
    setAttemptContent(event.target.innerText);
  };
  return (
    <section className="application_wrapper">
      <h1 className="headerTitle">질문을 작성해주세요</h1>
      <article className="application_container1">
        <div className="subTitle_container">
          <h1 className="subTitle">제목</h1>
          <h6 className="descriptionTitle">
            구체적으로 말씀하시고 다른 사람에게 질문을 한다고 생각해 보세요.
          </h6>
          <div className="subTitle_input">
            <input type="text" placeholder="제목을 작성해주세요." />
          </div>
        </div>
        <div className="applicationForm_container">
          <h1 className="subTitle">문제의 세부 사항은 무엇입니까?</h1>
          <h6 className="descriptionTitle">
            문제를 제목에 넣은 내용과 연관지어 작성해주세요.(단 최소 20자)
          </h6>
          {/* <div className="question_input detailInformation_input"> */}
          <div className="richEditorText richEditorText_container">
            <div className="options">
              {/* Text Format */}
              <button id="bold" className="option-button format">
                <FontAwesomeIcon icon={faBold} />
              </button>
              <button id="italic" className="option-button format">
                <FontAwesomeIcon icon={faItalic} />
              </button>
              <button id="underline" className="option-button format">
                <FontAwesomeIcon icon={faUnderline} />
              </button>
              <button id="strikethrough" className="option-button format">
                <FontAwesomeIcon icon={faStrikethrough} />
              </button>
              <button id="superscript" className="option-button script">
                <FontAwesomeIcon icon={faSuperscript} />
              </button>
              <button id="subscript" className="option-button script">
                <FontAwesomeIcon icon={faSubscript} />
              </button>
              {/* List */}
              <button id="insertOrderedList" className="option-button">
                <FontAwesomeIcon icon={faListOl} />
              </button>
              <button id="insertUnorderedList" className="option-button">
                <FontAwesomeIcon icon={faList} />
              </button>

              {/* undo/redo */}
              <button id="undo" className="option-button">
                <FontAwesomeIcon icon={faRotateLeft} />
              </button>
              <button id="redo" className="option-button">
                <FontAwesomeIcon icon={faRotateRight} />
              </button>
              {/* Link */}
              <button id="createLink" className="adv-option-button">
                <FontAwesomeIcon icon={faLink} />
              </button>
              <button id="unlink" className="option-button">
                <FontAwesomeIcon icon={faUnlink} />
              </button>

              {/* Alignment */}
              <button id="justifyLeft" className="option-button align">
                <FontAwesomeIcon icon={faAlignLeft} />
              </button>
              <button id="justifyCenter" className="option-button align">
                <FontAwesomeIcon icon={faAlignCenter} />
              </button>
              <button id="justifyRight" className="option-button align">
                <FontAwesomeIcon icon={faAlignRight} />
              </button>
              <button id="justifyFull" className="option-button align">
                <FontAwesomeIcon icon={faAlignJustify} />
              </button>
              <button id="indent" className="option-button spacing">
                <FontAwesomeIcon icon={faIndent} />
                <i className="fa-solid fa-indent"></i>
              </button>
              <button id="outdent" className="option-button spacing">
                <FontAwesomeIcon icon={faOutdent} />
                <i className="fa-solid fa-outdent"></i>
              </button>
              {/* Headings */}
              <select id="formatblock" className="adv-option-button">
                <option value="H1">H1</option>
                <option value="H2">H2</option>
                <option value="H3">H3</option>
                <option value="H4">H4</option>
                <option value="H5">H5</option>
                <option value="H6">H6</option>
              </select>
              {/* Font */}
              <select id="fontName" className="adv-option-button"></select>
              <select id="fontSize" className="adv-option-button"></select>

              {/* Color */}
              <div className="input-wrapper">
                <input
                  type="color"
                  id="foreColor"
                  className="adv-option-button"
                />
                <label htmlFor="foreColor">Font Color</label>
              </div>
              <div className="input-wrapper">
                <input
                  type="color"
                  id="backColor"
                  className="adv-option-button"
                />
                <label htmlFor="backColor">Highlight Color</label>
              </div>

              {/* image */}
              <button id="insertImage" className="option-button">
                <FontAwesomeIcon icon={faImage} />
                <i className="fa-solid fa-image"></i>
              </button>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                multiple
                style={{ display: "none" }}
              />
            </div>
            <div
              id="text-input"
              contentEditable={true}
              onInput={applicationHandleContentChange}
              dangerouslySetInnerHTML={{ __html: applicationContent }}
            ></div>
          </div>
          {/* </div> */}
        </div>
        <div className="attempt_container">
          <h1 className="subTitle">무엇을 시도하셨고 무엇을 기대하셨습니까?</h1>
          <h6 className="descriptionTitle">
            무엇을 시도했는지. 무엇이 일어날 것이라고 예상했는지. 그리고 실제로
            어떤 결과가 나타났는지 설명하세요.(단 최소 20자)
          </h6>
          <div className="richEditorText_container">
            <div className="options">
              {/* Text Format */}
              <button id="bold" className="option-button format">
                <FontAwesomeIcon icon={faBold} />
              </button>
              <button id="italic" className="option-button format">
                <FontAwesomeIcon icon={faItalic} />
              </button>
              <button id="underline" className="option-button format">
                <FontAwesomeIcon icon={faUnderline} />
              </button>
              <button id="strikethrough" className="option-button format">
                <FontAwesomeIcon icon={faStrikethrough} />
              </button>
              <button id="superscript" className="option-button script">
                <FontAwesomeIcon icon={faSuperscript} />
              </button>
              <button id="subscript" className="option-button script">
                <FontAwesomeIcon icon={faSubscript} />
              </button>
              {/* List */}
              <button id="insertOrderedList" className="option-button">
                <FontAwesomeIcon icon={faListOl} />
              </button>
              <button id="insertUnorderedList" className="option-button">
                <FontAwesomeIcon icon={faList} />
              </button>

              {/* undo/redo */}
              <button id="undo" className="option-button">
                <FontAwesomeIcon icon={faRotateLeft} />
              </button>
              <button id="redo" className="option-button">
                <FontAwesomeIcon icon={faRotateRight} />
              </button>
              {/* Link */}
              <button id="createLink" className="adv-option-button">
                <FontAwesomeIcon icon={faLink} />
              </button>
              <button id="unlink" className="option-button">
                <FontAwesomeIcon icon={faUnlink} />
              </button>

              {/* Alignment */}
              <button id="justifyLeft" className="option-button align">
                <FontAwesomeIcon icon={faAlignLeft} />
              </button>
              <button id="justifyCenter" className="option-button align">
                <FontAwesomeIcon icon={faAlignCenter} />
              </button>
              <button id="justifyRight" className="option-button align">
                <FontAwesomeIcon icon={faAlignRight} />
              </button>
              <button id="justifyFull" className="option-button align">
                <FontAwesomeIcon icon={faAlignJustify} />
              </button>
              <button id="indent" className="option-button spacing">
                <FontAwesomeIcon icon={faIndent} />
                <i className="fa-solid fa-indent"></i>
              </button>
              <button id="outdent" className="option-button spacing">
                <FontAwesomeIcon icon={faOutdent} />
                <i className="fa-solid fa-outdent"></i>
              </button>
              {/* Headings */}
              <select id="formatblock" className="adv-option-button">
                <option value="H1">H1</option>
                <option value="H2">H2</option>
                <option value="H3">H3</option>
                <option value="H4">H4</option>
                <option value="H5">H5</option>
                <option value="H6">H6</option>
              </select>
              {/* Font */}
              <select id="fontName" className="adv-option-button"></select>
              <select id="fontSize" className="adv-option-button"></select>

              {/* Color */}
              <div className="input-wrapper">
                <input
                  type="color"
                  id="foreColor"
                  className="adv-option-button"
                />
                <label htmlFor="foreColor">Font Color</label>
              </div>
              <div className="input-wrapper">
                <input
                  type="color"
                  id="backColor"
                  className="adv-option-button"
                />
                <label htmlFor="backColor">Highlight Color</label>
              </div>

              {/* image */}
              <button id="insertImage" className="option-button">
                <FontAwesomeIcon icon={faImage} />
                <i className="fa-solid fa-image"></i>
              </button>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                multiple
                style={{ display: "none" }}
              />
            </div>
            <div
              id="text-input"
              contentEditable={true}
              onInput={attemptHandleContentChange}
              dangerouslySetInnerHTML={{ __html: attemptContent }}
            ></div>
          </div>
        </div>
        <div className="tag_container">
          <h1 className="subTitle">태그를 작성해주세요.</h1>
          <div className="tag_input">
            <input type="text" placeholder="예) JAVA" />
          </div>
          <div className="application_footer">
            <div className="application_lang">
              <div className="application_lang_type">Java</div>
              <div className="application_lang_type">Javascript</div>
            </div>
          </div>
        </div>
      </article>
      <article className="application_container2">
        <div className="applicationBtn_container">
          <button className="appBtn">질문 등록하기</button>
        </div>
      </article>
    </section>
  );
}
