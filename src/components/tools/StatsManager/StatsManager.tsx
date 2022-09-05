import { useSelector } from 'react-redux';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button/Button';
import { saveEmptyStatistic } from '@/model/api-statistic';
import { deleteUserWord, getUserWords, getUserWordsCount } from '@/model/api-userWords';
import { RootState } from '@/store/store';

export const StatsManager = (): JSX.Element => {

  const learned = useRef<Array<string>>([]);
  const hard = useRef<Array<string>>([]);
  const neww = useRef<Array<string>>([]);

  const [learnedCount, setLC] = useState<number>(0);
  const [hardCount, setHC] = useState<number>(0);
  const [newCount, setNC] = useState<number>(0);

  const authState = useSelector((state: RootState) => state.authentication);

  const dropItem = async (el: string) =>{
    await deleteUserWord(authState.userId, el, authState.token);
  };

  const dropLearned = () =>{
    learned.current.forEach(el => {
      dropItem(el).catch(()=>{});
    });

  };
  const dropHard = () =>{
    hard.current.forEach(el => {
      dropItem(el).catch(()=>{});
    });
  };
  const dropNew = () =>{
    neww.current.forEach(el => {
      dropItem(el).catch(()=>{});
    });
  };

  const dropStats = async () => {
    await saveEmptyStatistic(authState.userId, authState.token);
  };

  const dropHandler = () => {
    dropStats().catch(()=>{});
  };

  useEffect(() => {

    const loadData = async () =>{
      // const currentStatistic = await getUserStatistic(authState.userId, authState.token);

      const allWords = await getUserWords(authState.userId, authState.token);
      learned.current = allWords!.filter(el => el.difficulty === 'learned').map(el => el.optional.wordId);
      hard.current = allWords!.filter(el => el.difficulty === 'hard').map(el => el.optional.wordId);
      neww.current = allWords!.filter(el => el.difficulty === 'new').map(el => el.optional.wordId);

      const lc =  await getUserWordsCount(authState.userId, authState.token, 'learned');
      if (lc) setLC(lc);
      const hc =  await getUserWordsCount(authState.userId, authState.token, 'hard');
      if (hc) setHC(hc);
      const nc =  await getUserWordsCount(authState.userId, authState.token, 'new');
      if (nc) setNC(nc);

    };

    loadData().catch(()=>{});
  }, [authState.token, authState.userId]);

  return (
    <section className='w-full flex flex-col items-center'>
      <h1>Debug and test tools</h1>

      <p>Learned words count: {`${learnedCount}`}</p>
      <p>Hard words count: {hardCount}</p>
      <p>New words count: {newCount}</p>

      <div className="flex justify-around">
        <Button
          text='Drop Learned'
          buttonType='primary'
          onClick={dropLearned}
        />
        <Button
          text='Drop Hard'
          buttonType='primary'
          onClick={dropHard}
        />
        <Button
          text='Drop New'
          buttonType='primary'
          onClick={dropNew}
        />
        <Button
          text='Drop Statistic'
          buttonType='primary'
          onClick={dropHandler}
        />
      </div>

    </section>
  );};
