import { IUserStatistic, IUserStatisticResponse } from './app-types';

import { addWordsProgressStats } from '@/components/games/GameResults/index';
import { API_ENDPOINT } from '@/model/constants';

// Update user's statistic

export async function updateUserStatistic (userId: string, token: string, newStats: IUserStatistic){

  const url = `${API_ENDPOINT}/users/${userId}/statistics`;
  const method = 'PUT';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify(newStats);
  console.log(body);

  let result: IUserStatistic | undefined;

  try {
    const response = await fetch(url, { method, headers, body });

    if (response.status === 200) {
      result = await response.json() as IUserStatistic;
    }
  } catch (e) { throw new Error(); }

  // console.log('updateUserStatistic');
  // console.log(result);

  return result;

}

export const emptyStats = () => {
  const currDate = new Date().toLocaleDateString('en-US');
  const wordsPerDay = { [currDate]: { learned: [], new: [] } };
  const learningDays = { days: [] };

  return {
    learnedWords: 0,
    optional: {
      wordsPerDay,
      learningDays,
      gamesStatistic: {
        gamesPerDay: {},
        resultsPerDay: {},
        gamesTotalCount: { audio: 0, sprint: 0 },
        bestStreak: 0,
        resultsTotal: {
          audio: { fail: 0, success: 0 },
          sprint: { fail: 0, success: 0 },
        },
      },
    },
  };

};

export const emptyWordStats = ()=> ({
  failed: 0,
  guessed: 0,
  streak: 0,
  last: false,
});

export async function saveEmptyStatistic (userId: string, userToken: string) {
  await updateUserStatistic(userId, userToken, emptyStats());
}

// Get user's statistic

export async function getUserStatistic (userId: string, token: string) {

  const url = `${API_ENDPOINT}/users/${userId}/statistics`;
  const method = 'GET';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  let result: IUserStatistic | undefined;

  try {
    const response = await fetch(url, { method, headers });
    if (response.status === 200) {
      const res = await response.json() as IUserStatisticResponse;
      result = {
        learnedWords: res.learnedWords,
        optional: res.optional,
      };
    }
    else if (response.status === 404) {
      await saveEmptyStatistic(userId, token);
      return emptyStats();
    }
  }
  catch (e) {
    throw new Error();
  }
  // console.log(JSON.stringify(result));
  // console.log(JSON.stringify(result).length);

  return result;
}

export async function addWordsToStatistic (userId: string, userToken: string) {

  const currentStatistic = await getUserStatistic(userId, userToken) || emptyStats();

  if (currentStatistic) {
    addWordsProgressStats(currentStatistic);
    await updateUserStatistic(userId, userToken, currentStatistic);
  }

}
