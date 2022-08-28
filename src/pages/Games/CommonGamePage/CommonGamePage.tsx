import { useSearchParams } from 'react-router-dom';

import { useEffect, useRef, useState } from 'react';

import './CommonGamePage.pcss';

import { AudioTrainBody } from '../AudioTrainPage/AudioTrainBody/AudioTrainBody';
import { SprintBody } from '../SprintPage/SprintBody/SprintBody';

import { GameDescription } from '@/components/games/GameDescription/GameDescription';
import { GameDifficulty } from '@/components/games/GameDifficulty/GameDifficulty';
import { GameResults } from '@/components/games/GameResults/GameResults';
import { Button } from '@/components/ui/Button/Button';
import { IGameResults } from '@/types/gameTypes';

export type GameType = 'sprint' | 'audio';
type GameNameMap = {
  [key in GameType]: string ;
};
type GameDescrMap = {
  [key in GameType]: string[];
};
export const gameName: GameNameMap = {
  sprint: 'Спринт',
  audio: 'Аудиовызов',
};
export const gameDescription: GameDescrMap = {
  sprint: [
    'В течение одной минуты отвечай соответствует ли слово предложенному переводу.',
    'Можно кликать по кнопкам, или нажимать клавиши стрелки',
  ],
  audio: [
    'Тренировка восприятия слов на слух.',
    'Надо выбрать правильный ответ из предложенных вариантов',
  ],
};

export interface GamePageProps {
  game: GameType;

}

export const CommonGamePage = ({ game }: GamePageProps): JSX.Element => {
  const [level, setLevel] = useState(1);
  const [currPage, setCurrPage] = useState(1);

  const [startedFromTextBook, setstartedFromTextBook] = useState(false);
  const [gameStarted, setgameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResults, setGameResults] = useState<IGameResults>();

  const [firstRun, setFirstRun] = useState(true);

  const page = useRef('');
  const group = useRef('');

  const dropDownChanged = (value: string) => {setLevel(+value - 1);  };

  const gameIsOver = (results: IGameResults) => {
    setGameEnded(true);
    setgameStarted(false);
    setGameResults(results);
  };

  const restartGame = () => {
    setGameEnded(false);
    setgameStarted(true);
  };

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (firstRun) {

      page.current = searchParams.get('page') || '';
      group.current = searchParams.get('group') || '';

      if (page.current && group.current){
        if (+page.current >=0 && +page.current <= 29 && +group.current >=0 && +group.current <= 5) {
          setLevel(+group.current);
          setCurrPage(+page.current);

          setgameStarted(true);
          setstartedFromTextBook(true);
        }
      }

      setFirstRun(false);

    }
  }, [firstRun, searchParams]);

  return (
    <div className="game">

      {!gameStarted && !gameEnded &&
      <GameDescription
        name={gameName[game]}
        description={gameDescription[game]}
      />
      }

      {!gameStarted && !gameEnded &&
      <GameDifficulty
        onChangeDiff={dropDownChanged}
        onStart={()=>setgameStarted(true)}/>
      }

      {gameStarted &&
      <div className="game_body">

        {game === 'sprint' &&
                <SprintBody
                  level={level}
                  page = {currPage}
                  startedFromBook = {startedFromTextBook}
                  onGameOver = {gameIsOver}
                />
        }
        {game === 'audio' &&
                <AudioTrainBody
                  level={level}
                  page = {currPage}
                  startedFromBook = {startedFromTextBook}
                  onGameOver = {gameIsOver}
                />
        }

      </div>
      }

      {gameEnded && gameResults &&
      <div className="game_body">
        <GameResults
          correctAnswers={gameResults.correctAnswers}
          wrongAnswers={gameResults.wrongAnswers}
          score = {gameResults.score}
        />
        <div className="game_restart">
          <Button buttonType='primary' text='Играть снова' onClick={restartGame} />
        </div>

      </div>
      }

    </div>
  );};
