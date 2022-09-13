import { MakeGenerics } from '@tanstack/react-location';

import { GameType } from './games-types';

export interface User {
  userId?: string;
  email: string;
  password: string;
  name?: string;
  message?: string;
  token?: string;
  refreshToken?: string;
};

export interface Word {
  id: string;
  _id? :string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
};

export interface UserWord {
  difficulty: UserWordDifficulty;
  optional:{
    statistic: GameStatsProgressWord;
    postDate: string;
    wordId:string;
    theWord?:string;
  };
};

export interface UserWordStats {
  numberOfMistakes?: number;
  numberOfRightGuess?: number;
  lastAnswerWasCorrect?: boolean;
}

export type LocationGenerics = MakeGenerics<{
  LoaderData: {
    words?: Word[];
  };
  Params: {
    group: string;
    page: string;
  };
  Search: {
    group: string;
    page: string;
  };
}>;

export interface ProgressWordMap {
  [id: string] : GameStatsProgressWord;
};

export interface GameStatsProgressWord {
  id?: string;
  word?: string;
  guessed: number;
  failed: number;
  streak : number;
  last: boolean;
};

export interface IUserStats {
  // gamesWordsProgress: ProgressWordMap;
  wordsPerDay?: WordsPerDayMap;
  learningDays: {days: Array<string>};
  gamesStatistic: GameStatisticMap;
};

export interface IUserStatisticResponse {
  id: number;
  learnedWords: number;
  optional : IUserStats;
};

export type IUserStatistic = Omit<IUserStatisticResponse, 'id'>;

export type UserWordDifficulty = 'hard' | 'learned' |  'new';
export type StatsWordDifficulty = 'new' | 'learned';

export type WordStats = {
  id: string;
  word?: string;
  type: StatsWordDifficulty;
};

export interface WordsPerDayMap {
  [date: string] : DaylyWordStats;
};

export type DaylyWordStats =  {
  [key in StatsWordDifficulty]: Array<string>;
};

export interface GameStatisticMap  {
  gamesPerDay: GamesPerDayMap;
  resultsPerDay: ResultsPerDayMap;
  gamesTotalCount: {[key in GameType]: number};
  resultsTotal: GameStatsTotal;
  bestStreak: number;
};

export type GameStatsTotal  = {
  [key in GameType]: GameResStatsItem;
};

export interface GamesPerDayMap {
  [date: string] : {[key in GameType]: number};
};

export interface ResultsPerDayMap {
  [date: string] : {
    [key in GameType]: GameResStatsItem};
};

export interface GameResStatsItem  {
  success: number;
  fail: number;
}
