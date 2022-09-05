import { useSelector } from 'react-redux';

import { addWordsToStats } from './index';

import { emptyStats, getUserStatistic, updateUserStatistic } from '@/model/api-statistic';
import { getUserWords, setUserWordDifficulty } from '@/model/api-userWords';
import { StatsWordDifficulty, WordStats } from '@/model/app-types';
import { GAMES_EDU_PROGRESS } from '@/model/constants';
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

  const authState = useSelector((state: RootState) => state.authentication);

  if (authState.isLoggedIn) {

    // Get current stats

    const currentStatistic = await getUserStatistic(userId, userToken) || emptyStats();
    const currentProgress = currentStatistic.optional.gamesWordsProgress || {};
    const currentDate = new Date().toLocaleDateString('en-US');

    // Get user words data

    const allWords = await getUserWords(userId, userToken);
    const learnedWords = allWords!.filter(el => el.difficulty === 'learned').map(el => el.optional.wordId);
    const hardWords = allWords!.filter(el => el.difficulty === 'hard').map(el => el.optional.wordId);

    const setWordDifficulty = async (word: ISprintWord, difficulty: StatsWordDifficulty) => {
      const isEntryExisted = !!(allWords?.find(el => el.optional.wordId === word.id));
      await setUserWordDifficulty(userId, userToken, word.id, word.word, difficulty, isEntryExisted)
        .catch(() => { });
    };

    const removeWordFormLearned = async (word: ISprintWord) => {
      await setWordDifficulty(word, 'new');
    };

    const saveWordAsLearned = async (word: ISprintWord) => {
      await setWordDifficulty(word, 'learned');

      addWordsToStats([{ id: word.id, type: 'learned' }], currentStatistic);
    };

    const saveWordsAsNew = (words: ISprintWord[]) => {
      words.forEach(el => {
        setWordDifficulty(el, 'new').catch(() => { });
      });

      const newStats: WordStats[] = words.map(el => ({ id: el.id, type: 'new' }));
      addWordsToStats(newStats, currentStatistic);
    };

    const isWordinListLearned = (wordId: string) => !!(learnedWords.find(el => el === wordId));
    const isWordinListHard = (wordId: string) => !!(hardWords?.find(el => el === wordId));

    const manageGuessStreak = (word: ISprintWord, currentStreak: number) => {
      let streak = currentStreak;
      if (
        !(isWordinListLearned(word.id))
        && currentStreak === GAMES_EDU_PROGRESS.guessWordToLearn
      ) {
        saveWordAsLearned(word).catch(() => { });
        streak = 0;
      }
      if (
        isWordinListHard(word.id)
        && currentStreak === GAMES_EDU_PROGRESS.guessHardWordToLearn
      ) {
        saveWordAsLearned(word).catch(() => { });
        streak = 0;
      }
      return streak;
    };

    // Define beststreak
    let bestStreak = 0;
    const setBestStreak = (value: number) => {
      if (value > bestStreak) bestStreak = value;
    };

    // Save new words

    const newWords = [...correctAnswers, ...wrongAnswers]
      .filter(el => (!isWordinListLearned(el.id) && !isWordinListHard(el.id)));

    saveWordsAsNew(newWords);

    // Loop thru answers

    correctAnswers.forEach(el => {
      if (currentProgress[el.id]) {
        currentProgress[el.id].g += 1;
        const curStreak = currentProgress[el.id].s + 1;
        setBestStreak(curStreak);
        currentProgress[el.id].s = manageGuessStreak(el, curStreak);
        currentProgress[el.id].l = true;
      }

      else {
        setBestStreak(1);

        currentProgress[el.id] = {
          g: 1,
          f: 0,
          s: 1,
          l: true,
        };
      }
    });

    wrongAnswers.forEach(el => {
      if (currentProgress[el.id]) {
        currentProgress[el.id].f += 1;
        currentProgress[el.id].g = 0;
        currentProgress[el.id].l = false;
      }
      else currentProgress[el.id] = {
        g: 0,
        f: 1,
        s: 0,
        word: el.word,
        l: false,
      };

      if (isWordinListLearned(el.id)) {
        removeWordFormLearned(el)
          .catch(() => { });
      }

    });

    // const newStatistic = await getUserStatistic(userId, userToken) || emptyStats();
    const newStatistic = currentStatistic;
    newStatistic.optional.gamesWordsProgress = currentProgress;

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
    // console.log(JSON.stringify(newStatistic));
    // console.log(JSON.stringify(newStatistic).length);

    await updateUserStatistic(userId, userToken, newStatistic);

  }

}
