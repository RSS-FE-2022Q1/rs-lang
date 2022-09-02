import { DaylyWordStats, IUserStatistic, IUserStatisticResponse, IUserStats,  WordStats } from './app-types';

import { API_ENDPOINT } from '@/model/constants';

// Get user's statistic
export async function getUserStatistic (userId:string, token:string){

  const url = `${API_ENDPOINT}/users/${userId}/statistics`;
  const method = 'GET';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  let result : IUserStatistic |  undefined;

  try{
    const response = await fetch(url, { method, headers });
    if (response.status === 200) {
      const res =  await response.json() as IUserStatisticResponse;
      result = {
        learnedWords: res.learnedWords,
        optional: res.optional,
      };
    }
  }
  catch (e){
    throw new Error();
  }

  return result;
}

// Update user's statistic

export async function updateUserStatistic (userId:string, token:string, newStats: IUserStatistic){

  const url = `${API_ENDPOINT}/users/${userId}/statistics`;
  const method = 'PUT';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify(newStats);

  let result : IUserStatistic | undefined;

  try{
    const response = await fetch(url, { method, headers, body });

    if (response.status === 200) {
      result =  await response.json() as IUserStatistic;
    }
  } catch (e) {throw new Error();}

  // console.log('updateUserStatistic');
  // console.log(result);

  return result;

}

// Partial update user's statistic

export async function setUserStatistic (userId:string, token: string, stats: IUserStats) {

  const currentStatistic = await getUserStatistic(userId, token) ;
  if(currentStatistic){

    const newStatistic = { ...currentStatistic };
    newStatistic.optional =  Object.assign(currentStatistic.optional, stats);
    await updateUserStatistic(userId, token, newStatistic);
  }

}

export const emptyStatistic: IUserStatistic  = {
  learnedWords: 0,
  optional: {
    gamesWordsProgress: {},
    wordsPerDay: {},
    gamesStatistic: {
      gamesPerDay: {},
      resultsPerDay: {},
      gamesTotalCount: { audio: 0, sprint: 0 },
    },
  },
};

export async function saveEmptyStatistic (userId: string, userToken: string) {
  await updateUserStatistic(userId, userToken, emptyStatistic);
}

export async function addWordsToStatistic (
  userId:string,
  userToken: string,
  words: WordStats[],
) {

  const update: DaylyWordStats = {

    'learned': [...new Set(words.filter(el=>el.type==='learned').map(el=>el.id))],
    'new': [...new Set(words.filter(el=>el.type==='new').map(el=>el.id))],
  };

  const currentDate = new Date().toLocaleDateString('en-US');
  const currentStatistic = await getUserStatistic(userId, userToken) || emptyStatistic;

  // console.log('currentStst');
  // console.log(currentStatistic);

  if (currentStatistic) {
    if (!currentStatistic.optional.wordsPerDay) currentStatistic.optional.wordsPerDay = {};

    const currentDateStats = currentStatistic.optional.wordsPerDay[currentDate];

    if (currentDateStats){

      Object.keys(currentDateStats).forEach(key=>{
        const entry = currentDateStats[key] as Array<string>;
        const updateEntry = update[key] as Array<string>;

        const upd = new Set([...entry, ...updateEntry]);
        currentDateStats[key] = [...upd];
      });

    } else {
      currentStatistic.optional.wordsPerDay[currentDate] = update;
    }

    // console.log('updating stats with: ');
    // console.log(currentStatistic);

    await updateUserStatistic(userId, userToken, currentStatistic);

  }

}
