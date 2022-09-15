import { IUserStatistic } from '@/model/app-types';

export function addWordsProgressStats (currentStats: IUserStatistic) {
  const currentDate = new Date().toLocaleDateString('en-US');

  if (currentStats) {

    const currentDateStats = currentStats.optional.learningDays.days || [];

    const update = new Set([...currentDateStats, currentDate]);

    // eslint-disable-next-line no-param-reassign
    currentStats.optional.learningDays.days = [...update];
  }

}
