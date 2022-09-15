import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { GameResultItem } from './GameResultItem/GameResultItem';
import { useSaveGameResultStats } from './useSaveGameResultStats';

import './GameResults.pcss';

import { IGameResults } from '@/model/games-types';
import { RootState } from '@/store/store';

export const GameResults =
  ({ correctAnswers, wrongAnswers, score, gameName, streak }: IGameResults): JSX.Element => {

    const getResultDesision = () => {
      if (correctAnswers.length === 0) return '';
      if (wrongAnswers.length === 0) return 'Отличный результат!';
      if (correctAnswers.length > wrongAnswers.length) return 'Хороший результат, продолжай учиться!';
      return 'Продолжай учиться, в следующий раз получится лучше';
    };

    const resultDesision = getResultDesision();

    const authState = useSelector((state:RootState) => state.authentication);

    useSaveGameResultStats(
      gameName,
      authState.userId,
      authState.token,
      correctAnswers,
      wrongAnswers,
      streak,
    ).catch(()=>{});

    return (
      <div className="results">
        <h2 className='results_heading'>Твой результат : {score}</h2>
        {resultDesision && <h4>{resultDesision}</h4>}
        <div className="results_table">

          <div className={classNames('results_list', 'results_correct')}>
            <h4 className='results_header'>Правильные ответы:</h4>
            {correctAnswers.map((el, i) => (
              <GameResultItem
                item={el}
                isOdd={i % 2 === 0}
                key={el.id}
              />
            ))}
          </div>
          <div className={classNames('results_list', 'results_wrong')}>
            <h4 className='results_header'>Ошибки:</h4>
            {wrongAnswers.map((el, i) => (
              <GameResultItem
                item={el}
                isOdd={i % 2 === 0}
                key={el.id}
              />
            ))}
          </div>
        </div>
      </div>

    );
  };
