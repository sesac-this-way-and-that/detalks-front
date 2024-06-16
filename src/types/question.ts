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
  questionId: string;
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
  answerList: AnswerDetail[];
  answerCount: number;
  tagNameList: string[];
  bookmarkState: boolean;
  questionRep: number;
}

  export interface AnswerDetail {
    answerId: string;
    answerContent: string;
    createdAt: Date;
    modifiedAt: Date;
    answerState: boolean;
    voteCount: number;
    isSelected: boolean;
    author: {
      memberIdx: number;
      memberName: string;
    };
}
