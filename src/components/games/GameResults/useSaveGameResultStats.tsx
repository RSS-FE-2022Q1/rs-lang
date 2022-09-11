import { useSelector } from 'react-redux';

import { addWordsProgressStats } from './index';

import { emptyStats, getUserStatistic, updateUserStatistic } from '@/model/api-statistic';
import { getUserWords, setUserWordDifficulty } from '@/model/api-userWords';
import { UserWordDifficulty } from '@/model/app-types';
import { GameType, ISprintWord } from '@/model/games-types';
import { RootState } from '@/store/store';

export interface IGameStats {
  total: number;
}

export async function useSaveGameResultStats (
  game: GameType,
  userId: string,
  userToken: string,
  correctAnswers: ISprintWord[],
  wrongAnswers: ISprintWord[],
) {

  const correctAnswerIds = correctAnswers.map(el => el.id);

  const authState = useSelector((state: RootState) => state.authentication);

  if (authState.isLoggedIn) {

    // Get current stats

    const currentStatistic = await getUserStatistic(userId, userToken) || emptyStats();
    const currentDate = new Date().toLocaleDateString('en-US');

    // Get user words data

    const allWords = await getUserWords(userId, userToken);
    const learnedWords = allWords!.filter(el => el.difficulty === 'learned').map(el => el.optional.wordId);
    const hardWords = allWords!.filter(el => el.difficulty === 'hard').map(el => el.optional.wordId);

    const setWordDifficulty = async (
      word: ISprintWord,
      difficulty: UserWordDifficulty,
      lastAnswer: boolean,
    ) => {
      const isEntryExisted = !!(allWords?.find(el => el.optional.wordId === word.id));

      await setUserWordDifficulty(
        userId, userToken, word.id, difficulty, isEntryExisted, lastAnswer,
      ).catch(() => { });
    };

    const removeWordFormLearned = async (word: ISprintWord) => {
      await setWordDifficulty(word, 'new', false);
    };

    const saveUserWordData = (words: ISprintWord[], status: UserWordDifficulty) => {
      words.forEach(el => {
        setWordDifficulty(el, status, correctAnswerIds.includes(el.id)).catch(() => { });
      });
    };

    const isWordinListLearned = (wordId: string) => !!(learnedWords.find(el => el === wordId));
    const isWordinListHard = (wordId: string) => !!(hardWords?.find(el => el === wordId));

    // Define beststreak
    let bestStreak = 0;
    const setBestStreak = (value: number) => {
      if (value > bestStreak) bestStreak = value;
    };

    // Save new words
    const encounteredWords = [...correctAnswers, ...wrongAnswers];

    const newWords = [...encounteredWords]
      .filter(el => (!isWordinListLearned(el.id) && !isWordinListHard(el.id)));

    saveUserWordData(newWords, 'new');

    const alreadyLearnedWords = [...encounteredWords]
      .filter(el => (isWordinListLearned(el.id)));

    saveUserWordData(alreadyLearnedWords, 'learned'); // just update statistic

    const hardButNewWords = [...encounteredWords]
      .filter(el => (isWordinListHard(el.id)));

    saveUserWordData(hardButNewWords, 'hard');  // just update statistic

    // Loop thru answers

    wrongAnswers.forEach(el => {

      if (isWordinListLearned(el.id)) {
        removeWordFormLearned(el)
          .catch(() => { });
      }

    });

    //  Statistic object

    const newStatistic = currentStatistic;

    const gameCounter = newStatistic.optional.gamesStatistic.gamesTotalCount[game] || 0;
    newStatistic.optional.gamesStatistic.gamesTotalCount[game] = gameCounter + 1;

    const resultsTotal = newStatistic.optional.gamesStatistic.resultsTotal[game];
    resultsTotal.fail += wrongAnswers.length;
    resultsTotal.success += correctAnswers.length;

    const currentBestStreak = newStatistic.optional.gamesStatistic.bestStreak || 0;
    newStatistic.optional.gamesStatistic.bestStreak = (currentBestStreak < bestStreak) ? bestStreak : currentBestStreak;

    if (!newStatistic.optional.gamesStatistic.gamesPerDay) {
      newStatistic.optional.gamesStatistic.gamesPerDay = {};
    }
    if (!newStatistic.optional.gamesStatistic.resultsPerDay) {
      newStatistic.optional.gamesStatistic.resultsPerDay = {};
    }

    if (!newStatistic.optional.gamesStatistic.gamesPerDay[currentDate])
      newStatistic.optional.gamesStatistic.gamesPerDay[currentDate] = { audio: 0, sprint: 0 };

    const curDateGamesCount = newStatistic.optional.gamesStatistic.gamesPerDay[currentDate][game];

    if (!curDateGamesCount) {
      newStatistic.optional.gamesStatistic.gamesPerDay[currentDate][game] = 1;
    } else {
      newStatistic.optional.gamesStatistic.gamesPerDay[currentDate][game] += 1;
    }

    if (!newStatistic.optional.gamesStatistic.resultsPerDay[currentDate])
      newStatistic.optional.gamesStatistic.resultsPerDay[currentDate] = {
        audio: {
          success: 0, fail: 0,
        }, sprint: {
          success: 0, fail: 0,
        },
      };

    const curDateResults = newStatistic.optional.gamesStatistic.resultsPerDay[currentDate][game];
    if (!curDateResults) {
      newStatistic.optional.gamesStatistic.resultsPerDay[currentDate][game] = {
        success: correctAnswers.length,
        fail: wrongAnswers.length,
      };
    } else {
      newStatistic.optional.gamesStatistic.resultsPerDay[currentDate][game] = {
        success: curDateResults.success + correctAnswers.length,
        fail: curDateResults.fail + wrongAnswers.length,
      };
    }

    addWordsProgressStats(newStatistic);

    await updateUserStatistic(userId, userToken, newStatistic);

  }

}
