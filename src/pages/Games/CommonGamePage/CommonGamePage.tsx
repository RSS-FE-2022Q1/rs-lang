import { useSearch } from '@tanstack/react-location';

import { useEffect, useRef, useState } from 'react';

import './CommonGamePage.pcss';

import { AudioTrainBody } from '../AudioTrainPage/AudioTrainBody/AudioTrainBody';
import { SprintBody } from '../SprintPage/SprintBody/SprintBody';

import { GameDescription } from '@/components/games/GameDescription/GameDescription';
import { GameDifficulty } from '@/components/games/GameDifficulty/GameDifficulty';
import { GameResults } from '@/components/games/GameResults/GameResults';
import { Button } from '@/components/ui/Button/Button';
import type { LocationGenerics } from '@/model/app-types';
import { DEFAULT_GROUP_COUNT, PAGES_PER_GROUP } from '@/model/constants';
import { GameType, IGameResults } from '@/model/games-types';

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

  const searchParams = useSearch<LocationGenerics>();
  const { group:groupFromSearch, page:pageFromSearch } = searchParams;

  useEffect(() => {
    if (firstRun) {

      page.current = (pageFromSearch !== undefined) ?  pageFromSearch : '-1';
      group.current = (groupFromSearch !== undefined) ?  groupFromSearch : '-1';

      if ( +page.current >= 0
            && +page.current < PAGES_PER_GROUP
            && +group.current >=0
            && +group.current < DEFAULT_GROUP_COUNT
      ) {
        setLevel(+group.current);
        setCurrPage(+page.current);

        setgameStarted(true);
        setstartedFromTextBook(true);
      }

      setFirstRun(false);

    }
  }, [firstRun, groupFromSearch, pageFromSearch, searchParams]);

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
                  gameName = {game}
                />
        }
        {game === 'audio' &&
                <AudioTrainBody
                  level={level}
                  page = {currPage}
                  startedFromBook = {startedFromTextBook}
                  onGameOver = {gameIsOver}
                  gameName = {game}
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
          gameName = {game}
        />
        <div className="game_restart">
          <Button buttonType='primary' text='Играть снова' onClick={restartGame} />
        </div>

      </div>
      }

    </div>
  );};
