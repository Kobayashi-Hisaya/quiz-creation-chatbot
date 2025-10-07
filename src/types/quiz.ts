export interface QuizChoice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface BlankSpot {
  line: number;
  start: number;
  end: number;
  originalText: string;
}

export interface QuizQuestion {
  id: string;
  problemText: string;
  codeWithBlanks: string;
  originalCode: string;
  blankSpots: BlankSpot[];
  choices: QuizChoice[];
  correctChoiceId: string;
  explanation: string;
  learningTopic: string;
  language: string;
}

export interface AutoGenerationRequest {
  problemText: string;
  code: string;
  language: string;
  learningTopic: string;
}

export interface AutoGenerationResponse {
  problemText: string;
  codeWithBlanks: string;
  choices: QuizChoice[];
  correctChoiceId: string;
  explanation: string;
}