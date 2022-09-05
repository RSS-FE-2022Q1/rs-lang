/* eslint-disable no-param-reassign */
import { DaylyWordStats, IUserStatistic, WordStats } from '@/model/app-types';

export function addWordsToStats (words: WordStats[], currentStats: IUserStatistic) {

  const update: DaylyWordStats = {

    'learned': [...new Set(words.filter(el => el.type === 'learned').map(el => el.id))],
    'new': [...new Set(words.filter(el => el.type === 'new').map(el => el.id))],
  };

  const currentDate = new Date().toLocaleDateString('en-US');

  if (currentStats) {

    let currentDateStats = currentStats.optional.wordsPerDay[currentDate];

    if (currentDateStats) {

      Object.keys(currentDateStats).forEach(key => {
        const entry = currentDateStats[key] as Array<string>;
        const updateEntry = update[key] as Array<string>;

        const upd = new Set([...entry, ...updateEntry]);
        currentDateStats[key] = [...upd];
      });

    } else {
      currentStats.optional.wordsPerDay[currentDate] = { learned: [], new: [] };
      currentStats.optional.wordsPerDay[currentDate].learned = update.learned;
      currentStats.optional.wordsPerDay[currentDate].new = update.new;

      currentDateStats = update;
    }

  }

}
