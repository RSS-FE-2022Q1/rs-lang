import './Statistics.pcss';

import { useSelector } from 'react-redux';

import { useEffect, useState } from 'react';

import { Graph } from './Graphic/Graphic';
import { TableCard } from './TableCard/TableCard';

import { emptyStats, getUserStatistic } from '@/model/api-statistic';
import { getUserWordsCount } from '@/model/api-userWords';
import { GameResStatsItem, GamesPerDayMap, GameStatsTotal, IUserStatistic, ResultsPerDayMap, StatsWordDifficulty, WordsPerDayMap } from '@/model/app-types';
import { GameType } from '@/model/games-types';
import { RootState } from '@/store/store';

const cumulativeSum = (arr: number[]) => arr.reduce((p, c, i)=>{
  const pp = (i > 0)? (p[p.length-1] as number) + c : c;
  const a: number[] = [...p];
  a.push(pp);
  return a;
}, []);

const getWinPercent = (score: GameResStatsItem | undefined) => {

  if (score) {
    const total = score.fail + score.success;
    return total ? (score.success / total * 100).toFixed(1) : '-';
  }

  return '-';
};

const getFullWinPercent = (stats: GameStatsTotal | undefined) => {
  if (stats) {
    const audio = getWinPercent(stats.audio);
    const sprint = getWinPercent(stats.sprint);

    let total = 0;

    if ((audio !== '-') && (sprint !== '-')) total = ((+audio + +sprint)/2);
    else total = (((audio !== '-') ? +audio : 0) + ((sprint !== '-') ? +sprint : 0));

    return total.toFixed(1);
  }

  return 0;

};

const Statistics = (): JSX.Element => {
  const [learnedCount, setLC] = useState<number>(0);
  const [hardCount, setHC] = useState<number>(0);

  const [stats, setStats] = useState<IUserStatistic>();

  const [graphWordsLabels, setgraphWordsLabels] = useState<string[]>([]);
  const [graphWordsValues, setgraphWordsValues] = useState<number[]>([]);
  const [graphNewWordsValues, setgraphNewWordsValues] = useState<number[]>([]);
  const [graphWordsReady, setgraphDataReady] = useState<boolean>(false);

  const [graphWinsLabels, setgraphWinsLabels] = useState<string[]>([]);
  const [graphWinsValues, setgraphWinsValues] = useState<number[]>([]);
  const [graphWinsReady, setgraphWinsReady] = useState<boolean>(false);

  const authState = useSelector((state: RootState) => state.authentication);
  const currDate = new Date().toLocaleDateString('en-US');

  useEffect(() => {
    const loadData = async () => {
      const lc = await getUserWordsCount(authState.userId, authState.token, 'learned');
      if (lc) setLC(lc);
      const hc = await getUserWordsCount(authState.userId, authState.token, 'hard');
      if (hc) setHC(hc);

      const currentStatistic =
        await getUserStatistic(authState.userId, authState.token) || emptyStats();

      if (currentStatistic) setStats(currentStatistic);

      if (currentStatistic?.optional.wordsPerDay) {
        const labels: string[] = [];
        const learned: number[] = [];
        const newWords: number[] = [];
        Object.entries(currentStatistic?.optional.wordsPerDay)
          .forEach(([key, value]) => {
            labels.push(key);
            learned.push(value.learned.length);
            newWords.push(value.new.length);
          });
        setgraphWordsLabels(labels);
        setgraphWordsValues(learned);
        setgraphNewWordsValues(newWords);
        setgraphDataReady(true);
      }

      if (currentStatistic?.optional.gamesStatistic.resultsPerDay) {
        const labels: string[] = [];
        const values: number[] = [];
        Object.entries(currentStatistic.optional.gamesStatistic.resultsPerDay)
          .forEach(([key, value]) => {
            labels.push(key);
            values.push(+getFullWinPercent(value));
          });
        setgraphWinsLabels(labels);
        setgraphWinsValues(values);
        setgraphWinsReady(true);
      }
    };

    loadData().catch(() => { });
  }, [authState.userId, authState.token, currDate]);

  const getWordsCount = (
    entry: WordsPerDayMap | undefined,
    type: StatsWordDifficulty,
  ) => (entry && Object.keys(entry).includes(currDate))
    ? entry[currDate][type].length : 0;

  const getData = (
    entry: GamesPerDayMap | undefined,
    game: GameType,
  ) => (entry && Object.keys(entry).includes(currDate))
    ? entry[currDate][game] : 0;

  const getResData = (
    entry: ResultsPerDayMap | undefined,
    game: GameType,
  ) => (entry && Object.keys(entry).includes(currDate))
    ? entry[currDate][game] : undefined;

  return (
    <section className="stats">
      <div className="stats_container">

        <TableCard
          heading='Общая статистика'
          subheading='За все время'
          items={[
            { title: 'Изученных слов', content: `${(learnedCount || '-')}` },
            { title: 'Слов, помеченных как сложные', content: `${(hardCount || '-')}` },
            {
              title: 'Процент верных ответов',
              content: `${getFullWinPercent(stats?.optional.gamesStatistic.resultsTotal) || '-'}`,
            },
          ]}
        />

        <TableCard
          heading='Статистика за сегодня'
          items={[
            {
              title: 'Встречено новых слов',
              content: `${getWordsCount(stats?.optional.wordsPerDay, 'new') || '-'}`,
            },
            {
              title: 'Изучено слов',
              content: `${getWordsCount(stats?.optional.wordsPerDay, 'learned') || '-'}`,
            },
          ]}
        />

        <TableCard
          heading='Мини игры'
          subheading='Статистика за все время'
          items={[
            {
              title: 'Сыграно игр',
              content: [
                {
                  title: 'Спринт',
                  content: `${stats?.optional.gamesStatistic.gamesTotalCount.sprint || '-'}`,
                },
                {
                  title: 'Аудиовызов',
                  content: `${stats?.optional.gamesStatistic.gamesTotalCount.audio || '-'}`,
                },
              ],
            },
            {
              title: 'Процент верных ответов',
              content: [
                {
                  title: 'Спринт',
                  content: getWinPercent(
                    stats?.optional.gamesStatistic.resultsTotal.sprint,
                  ),
                },
                {
                  title: 'Аудиовызов',
                  content: getWinPercent(
                    stats?.optional.gamesStatistic.resultsTotal.audio,
                  ),
                },
              ],
            },
            {
              title: 'Самая длинная серия правильных ответов',
              content: `${stats?.optional.gamesStatistic.bestStreak || '-'}`,
            },
          ]}
        />

        <TableCard
          heading='Мини игры'
          subheading='Статистика за сегодня'
          items={[
            {
              title: 'Сыграно игр',
              content: [
                {
                  title: 'Спринт',
                  content: `${getData(stats?.optional.gamesStatistic.gamesPerDay, 'sprint') || '-'}`,
                },
                {
                  title: 'Аудиовызов',
                  content: `${getData(stats?.optional.gamesStatistic.gamesPerDay, 'audio') || '-'}`,
                },
              ],
            },
            {
              title: 'Процент верных ответов',
              content: [
                {
                  title: 'Спринт',
                  content: getWinPercent(
                    getResData(stats?.optional.gamesStatistic.resultsPerDay, 'sprint'),
                  ),
                },
                {
                  title: 'Аудиовызов',
                  content: getWinPercent(
                    getResData(stats?.optional.gamesStatistic.resultsPerDay, 'audio'),
                  ),
                },
              ],
            },
          ]}
        />
        {graphWordsReady && (
          <>
            <Graph
              heading='Новые слова по дням'
              labels={graphWordsLabels}
              values={graphNewWordsValues}
              label='Новые слова'
            />

            <Graph
              heading='Изученные слова нарастающим итогом'
              labels={graphWordsLabels}
              values={cumulativeSum(graphWordsValues)}
              label='Изученные слова'
            />
          </>

        )}

        {graphWinsReady && (
          <Graph
            heading='Процент верных ответов в мини играх'
            subheading='Долгосрочная статитика по дням'
            labels={graphWinsLabels}
            values={graphWinsValues}
            label='Процент верных ответов'
          />
        )}

      </div>
    </section>
  );
};
export default Statistics;
