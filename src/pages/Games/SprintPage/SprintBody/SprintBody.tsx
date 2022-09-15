import { VolumeOffIcon, VolumeUpIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import { useEffect, useRef, useState } from 'react';

import { getRandomIndex, loadWords, getRandomPage, loadWordsWithoutLearned } from '../../CommonGamePage/index';
import { StreakCounter } from '../StreakCounter/StreakCounter';
import { Timer } from '../Timer/Timer';

import './SprintBody.pcss';
import { PlayAudio } from '@/components/PlayAudio/PlayAudio';
import { PlaySoundEffect } from '@/components/PlaySoundEffect/PlaySoundEffect';
import { Button } from '@/components/ui/Button/Button';
import { GameControlButton } from '@/components/ui/GameControlButton/GameControlButton';
import { useOnKeyUp } from '@/hooks/useOnKeyUpDocument';
import { Word } from '@/model/app-types';
import { FILESTORAGE_URL, GAME_RULES } from '@/model/constants';
import { GameBodyProps, IGameResults, ISprintWord, PlaySoundItem } from '@/model/games-types';
import { RootState } from '@/store/store';

const { BASE_SCORE } = GAME_RULES.sprint;
const { MAX_MULTIPLIER } = GAME_RULES.sprint;

const happySmiles = ['😊', '😆', '😁', '😄', '😅', '🙃', '😃', '😋'];
const sadSmiles = ['😬', '😐', '🤔', '😑', '🙄', '😕'];

type AnswerType = 'accept' | 'decline';

export const SprintBody = (
  { level, page, startedFromBook, onGameOver, gameName }: GameBodyProps,
): JSX.Element => {
  const [firstRun, setFirstRun] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longStreak, setLongStreak] = useState<Array<number>>([0]);
  const [multiplier, setmultiplier] = useState(1);
  const [task, setTask] = useState<ISprintWord>();
  const [smileFace, setSmileFace] = useState('🙂');
  const [animateSmile, setAnimateSmile] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const [animateMultiplier, setAnimateMultiplier] = useState(false);

  const [playSoundItem, setPlaySoundItem] = useState<PlaySoundItem>();
  const [gameSound, setGameSound] = useState(true);

  const usedWords = useRef<ISprintWord[]>([]);
  const usedPages = useRef<number[]>([]);
  const wordList = useRef<ISprintWord[]>([]);
  const currentWords = useRef<ISprintWord[]>([]);

  const correctAnswers = useRef<ISprintWord[]>([]);
  const wrongAnswers = useRef<ISprintWord[]>([]);

  const authState = useSelector((state:RootState) => state.authentication);

  const gameOver = () => {
    const gameResults: IGameResults = {
      correctAnswers: correctAnswers.current,
      wrongAnswers: wrongAnswers.current,
      score: `${score} баллов`,
      gameName,
      streak: Math.max(...longStreak),
    };

    onGameOver(gameResults);
  };

  const getAssignment = () => {
    if (wordList.current.length > 0) {

      const index = getRandomIndex(wordList.current.length);
      const assigment = wordList.current[index];

      wordList.current.splice(index, 1);
      usedWords.current.push(assigment);

      if (Math.random() < 0.5 ) {
        const randomIndex = getRandomIndex(currentWords.current.length, [index]);

        assigment.translateProposal = [(currentWords.current[randomIndex].wordTranslate)];
      } else assigment.translateProposal = [(assigment.wordTranslate)];

      setTask(assigment);
    }

    else if (startedFromBook) { gameOver(); }
    else {
      const nextPage = getRandomPage(usedPages.current);
      usedPages.current.push(nextPage);

      loadWords(level, nextPage)
        .then((data: Word[]) => {
          wordList.current = [...data];
          currentWords.current = [...data];
          getAssignment();
        })
        .catch(() => { });
    }
  };

  useEffect(() => {
    if (firstRun) {
      usedPages.current.push(page);

      const initData = (data: Word[]) => {
        wordList.current = [...data];
        setFirstRun(false);
        getAssignment();
      };

      if (startedFromBook) {
        loadWords(level, page)
          .then((data: Word[])=>{
            currentWords.current = [...data];
          }).catch(()=>{});

        loadWordsWithoutLearned(level, page, authState.userId, authState.token)
          .then((data: Word[])=>{
            initData(data);
          }).catch(()=>{});

      } else {

        loadWords(level, page)
          .then((data: Word[])=>{
            currentWords.current = [...data];
            initData(data);
          }).catch(()=>{});
      }

    }
  }, [firstRun, level, page]);

  const setAnswerEffects = (isCorrect: boolean) => {
    const getSmile = isCorrect
      ? happySmiles[getRandomIndex(happySmiles.length, [happySmiles.indexOf(smileFace)])]
      : sadSmiles[getRandomIndex(sadSmiles.length,  [sadSmiles.indexOf(smileFace)])];

    setSmileFace(getSmile);
    setAnimateSmile(true);

    if (gameSound)
      setPlaySoundItem({ id: task!.id, isPlaying: true, sourceId: ((isCorrect ? 0 : 1)) });

  };

  const handleStreak = (isCorrect: boolean) => {
    const ls = [...longStreak];

    if (isCorrect) {
      ls[ls.length-1] += 1;

      if (streak === 2) {
        setmultiplier(prev => prev < MAX_MULTIPLIER ? prev * 2 : prev);
        if (multiplier < MAX_MULTIPLIER) setAnimateMultiplier(true);
        setStreak(prev => prev + 1);
      } else if (streak === 3) setStreak(0);
      else setStreak(prev => prev + 1);

    } else {
      ls.push(0);

      setStreak(0);
      setmultiplier(prev => prev > 1 ? prev / 2 : prev);
    }

    setLongStreak(ls);
  };

  const handleAnswer = (answer: AnswerType) => {
    if (task) {
      let isAnswerCorect = false;
      if (task?.wordTranslate === task.translateProposal![0] && answer === 'accept') isAnswerCorect = true;
      else if (task?.wordTranslate !== task.translateProposal![0] && answer === 'decline') isAnswerCorect = true;
      else isAnswerCorect = false;

      if (isAnswerCorect) correctAnswers.current.push(task);
      else wrongAnswers.current.push(task);

      setAnswerEffects(isAnswerCorect);

      handleStreak(isAnswerCorect);

      const scoreIncrement = isAnswerCorect ? multiplier * BASE_SCORE : 0;
      setScore(prev => prev + scoreIncrement);
      if (isAnswerCorect) setAnimateScore(true);

      getAssignment();
    }

  };

  const acceptHandler = () => { handleAnswer('accept'); };

  const declineHandler = () => { handleAnswer('decline'); };

  useOnKeyUp((code: string) => {
    if (code === 'ArrowLeft') declineHandler();
    else if (code === 'ArrowRight') acceptHandler();
  });

  return (
    <div className="sprint">
      <div className="sprint_info" >
        <div className="sprint_controls">
          <div className="control_wrapper" data-tip="Звуковые эффекты">
            <GameControlButton
              icons={{ 'first': VolumeUpIcon, 'second': VolumeOffIcon }}
              onChange={value => setGameSound(value)}
            />
          </div>
        </div>
        <div className='sprint_score'>
          <span className="score_text">Результат: </span>
          <div
            className={animateScore ? 'score_animate' : ''}
            onAnimationEnd={() => setAnimateScore(false)}
          >
            {score}
          </div>
        </div>
        <div className="sprint_timer">
          <Timer seconds={60} onTimeUp={gameOver} />
        </div>

      </div>
      <div className="sprint_form">

        <div className="sprint_streak">
          <div className="streak_line_cell" />
          <StreakCounter currentStreak={streak} />
          <div
            className="streak_line_cell"
          >
            <div
              className={classNames('multi_value', animateMultiplier ? 'score_animate' : '')}
              onAnimationEnd={() => setAnimateMultiplier(false)}
            >
              x {BASE_SCORE * multiplier}
            </div>
          </div>
        </div>

        <div
          onAnimationEnd={() => setAnimateSmile(false)}
          className={classNames('sprint_picture', animateSmile && 'smile_animate')}
        >
          {smileFace}
        </div>

        <div className="sprint_ask">
          <div className="streak_ask_cell" />
          <span className="ask_word">{task?.word}</span>
          <div className="streak_ask_cell">
            <PlayAudio
              source={task ? FILESTORAGE_URL + task.audio : ''}
              additionalSources = {task ? [
                FILESTORAGE_URL + task.audioMeaning!,
                FILESTORAGE_URL + task.audioExample!,
              ] : []}
              type='single-button'
            />
          </div>

        </div>
        <div className="sprint_answer">{task?.translateProposal}</div>

        <div className="sprint_buttons">
          <Button
            text='&#9664; Неверно'
            buttonType='decline'
            onClick={declineHandler}
          />
          <Button
            text='Верно &#9654;'
            buttonType='accept'
            onClick={acceptHandler}
          />
        </div>
      </div>

      <PlaySoundEffect
        playEvent={playSoundItem!}
      />
      <ReactTooltip/>
    </div>

  );
};
