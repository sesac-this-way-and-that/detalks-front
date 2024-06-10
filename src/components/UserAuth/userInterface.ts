export interface AccountForm {
  accessType: string; // 페이지 유형에 따라 변수로 사용할 수 있는 prop (ex. login, register)
  accessText?: string; // 화면에 출력하기 위한 텍스트 (ex. 로그인, 회원가입)
  accessForm?(): void; // 정보 전송 버튼 클릭 시 각각 적용되는 함수
}

export function Logout() {
  localStorage.removeItem("loginToken");
}
