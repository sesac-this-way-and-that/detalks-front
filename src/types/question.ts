export interface QuestionInformation {
  answerList: any[];
  author: {
    memberIdx: number;
    memberName: string;
  };
  bookmarkState: boolean;
  createdAt: Date;
  isSolved: boolean;
  modifiedAt: Date;
  questionContent: string;
  questionId: number;
  questionState: boolean;
  questionTitle: string;
  tagNameList: string[];
  viewCount: number;
  voteCount: number;
}

export interface QuestionDetail {
  questionId: number;
  questionTitle: string;
  questionContent: string;
  createdAt: Date;
  modifiedAt: Date;
  viewCount: number;
  voteCount: number;
  questionState: boolean;
  isSolved: boolean;
  author: {
    memberIdx: number;
    memberName: string;
  };
  answerList: string[];
  tagNameList: string[];
  bookmarkState: boolean;
}
