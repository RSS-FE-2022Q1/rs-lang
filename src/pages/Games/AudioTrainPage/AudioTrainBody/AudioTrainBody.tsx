import { VolumeOffIcon, VolumeUpIcon , XCircleIcon, BadgeCheckIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import { useEffect, useRef, useState } from 'react';

import { getRandomIndex, loadWords, loadWordsWithoutLearned } from '../../CommonGamePage/index';

import { PlayAudio } from '@/components/PlayAudio/PlayAudio';
import { PlaySoundEffect } from '@/components/PlaySoundEffect/PlaySoundEffect';
import { Speaker } from '@/components/games/Speaker/Speaker';
import { Button } from '@/components/ui/Button/Button';
import { GameControlButton } from '@/components/ui/GameControlButton/GameControlButton';
import { MarkButton } from '@/components/ui/MarkButton/MarkButton';
import { useOnKeyUp } from '@/hooks/useOnKeyUpDocument';
import { Word } from '@/model/app-types';
import { FILESTORAGE_URL } from '@/model/constants';
import { IGameResults, GameBodyProps, ISprintWord, PlaySoundItem, MButtonEvent } from '@/model/games-types';
import './AudioTrainBody.pcss';
import { RootState } from '@/store/store';

export const AudioTrainBody = (
  { level, onGameOver, page, gameName, startedFromBook }: GameBodyProps): JSX.Element => {

  const [firstRun, setFirstRun] = useState(true);
  const [score, setScore] = useState(0);
  const [antiScore, setAntiScore] = useState(0);
  const [animateScore, setAnimateScore] = useState(false);
  const [animateAntiScore, setAnimateAntiScore] = useState(false);

  const [task, setTask] = useState<ISprintWord>();
  const [taskCounter, setTaskCounter] = useState(0);
  const [taskTotal, setTaskTotal] = useState(0);

  const [buttonEvent, setButtonEvent] = useState<MButtonEvent>();
  const [showCorrectAnswer, setshowCorrectAnswer] = useState(false);

  const [playSoundItem, setPlaySoundItem] = useState<PlaySoundItem>();
  const [playTaskAudio, setPlayTaskAudio] = useState<PlaySoundItem>();
  const [gameSound, setGameSound] = useState(true);

  const usedWords = useRef<ISprintWord[]>([]);
  const usedPages = useRef<number[]>([]);
  const wordList = useRef<ISprintWord[]>([]);
  const currentWords = useRef<ISprintWord[]>([]);

  const correctAnswers = useRef<ISprintWord[]>([]);
  const wrongAnswers = useRef<ISprintWord[]>([]);

  const lastPickedAnswer = useRef('');

  const authState = useSelector((state:RootState) => state.authentication);

  const gameOver = () => {
    const gameResults: IGameResults = {
      correctAnswers: correctAnswers.current,
      wrongAnswers: wrongAnswers.current,
      score: `${score}/${taskTotal}`,
      gameName,
    };

    onGameOver(gameResults);
  };

  const resetAnswerButtons = () => {
    setButtonEvent (
      {
        drawIcon: false,
        correctValue: '',
        pickedValue: '',
      },
    );
  };

  const getAssignment = () => {

    if (wordList.current.length > 0) {
      const index = getRandomIndex(wordList.current.length);
      const assigment = wordList.current[index];

      wordList.current.splice(index, 1);
      usedWords.current.push(assigment);

      const usedIndexes = [currentWords.current.findIndex(el=>el.word === assigment.word)];
      const randomUniques = Array(4).fill('').map(()=>{
        const random = getRandomIndex(currentWords.current.length, usedIndexes);
        usedIndexes.push(random);
        return random;
      });

      assigment.translateProposal = randomUniques
        .map(el=>currentWords.current[el].wordTranslate);

      assigment.translateProposal.push(assigment.wordTranslate);

      assigment.translateProposal.sort();

      setTask(assigment);
      setPlayTaskAudio({ id: assigment.id, isPlaying: true, sourceId: 1 });
      setTaskCounter(prev=>prev + 1);

    } else gameOver();

  };

  const setAnswerEffects = (isCorrect: boolean) => {
    if (gameSound)
      setPlaySoundItem({ id: task!.id, isPlaying: true, sourceId: ((isCorrect ? 0 : 1)) });

    setButtonEvent (
      {
        drawIcon: true,
        correctValue: task!.wordTranslate,
        pickedValue:  lastPickedAnswer.current,
      },
    );

  };

  const handleAnswer = (answer: string) => {

    if (task && !showCorrectAnswer) {
      const isAnswerCorect = (task?.wordTranslate === answer);

      if (isAnswerCorect) correctAnswers.current.push(task);
      else wrongAnswers.current.push(task);

      lastPickedAnswer.current = answer;

      setAnswerEffects(isAnswerCorect);

      const scoreIncrement = isAnswerCorect ? 1 : 0;
      setScore(prev => prev + scoreIncrement);
      setAntiScore(prev=>prev + (isAnswerCorect ? 0 : 1));

      setAnimateScore(isAnswerCorect);
      setAnimateAntiScore(!isAnswerCorect);

      setshowCorrectAnswer(true);
    }

  };

  const goNextHandler = () => {
    if (showCorrectAnswer) {
      resetAnswerButtons();
      getAssignment();
      setshowCorrectAnswer(false);
    } else handleAnswer('');
  };

  const handleKeyPress = (code: string) => {
    const index = + code[code.length-1] - 1;

    if (task){
      const bindedAnswer = task.translateProposal![index];
      handleAnswer(bindedAnswer);
    }
  };

  useEffect(() => {
    if (firstRun) {
      usedPages.current.push(page);

      const initData = (data: Word[]) => {
        wordList.current = [...data];
        setTaskTotal(data.length);
        setFirstRun(false);
        resetAnswerButtons();
        getAssignment();
      };

      if (startedFromBook) {
        loadWords(level, page)
          .then((data: Word[]) => {
            currentWords.current = [...data];
          }).catch(() => { });

        loadWordsWithoutLearned(level, page, authState.userId, authState.token)
          .then((data: Word[]) => {
            initData(data);
          }).catch(() => { });

      } else {

        loadWords(level, page)
          .then((data: Word[]) => {
            currentWords.current = [...data];
            initData(data);
          }).catch(() => { });
      }

    }
  }, [firstRun, level, page]);

  useOnKeyUp((code: string) => {
    const digitKeyCodes = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'];
    if (digitKeyCodes.includes(code)) handleKeyPress(code);

    else if (code === 'Space') goNextHandler();
  });

  return (
    <div className="audiogame">
      <div className="audiogame_info" >
        <div className="audiogame_controls">
          <div className="control_wrapper" data-tip="Звуковые эффекты">
            <GameControlButton
              icons={{ 'first': VolumeUpIcon, 'second': VolumeOffIcon }}
              onChange={value => setGameSound(value)}
            />
          </div>

        </div>
        <div className='audiogame_score'>
          <div className="score_cell">
            <BadgeCheckIcon className='score_icon score_icon_ok' />
            <div
              className={animateScore ? 'score_animate' : ''}
              onAnimationEnd={() => setAnimateScore(false)}
            >
              <span className="score_text">{score}</span>
            </div>
          </div>
          <div className="score_cell">
            <XCircleIcon className='score_icon score_icon_fail' />
            <div
              className={animateAntiScore ? 'score_animate' : ''}
              onAnimationEnd={() => setAnimateAntiScore(false)}
            >
              <span className="score_text">{antiScore}</span>
            </div>
          </div>

        </div>
        <div className="audiogame_progress">
          {taskCounter}/{taskTotal}
        </div>
      </div>

      <div className="audiogame_form">
        <div className="audiogame_ask">

          { !showCorrectAnswer &&
            <Speaker
              source={task ? FILESTORAGE_URL + task.audio : ''}
              playEvent={playTaskAudio!}
            />
          }

          { showCorrectAnswer &&

          <div className="audiogame_ans">
            <div className="answer_image_wrapper">
              <img
                className='answer_image'
                src={task ? FILESTORAGE_URL + task.image : ''}
                alt={task?.word} />
            </div>

            <div className="answer_text">
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
          </div>
          }

        </div>

        <div className="audiogame_answers">
          {task?.translateProposal?.map((el, i) => (
            <div className='audiogame_answer' key={`${(i+1) * Math.random()}`} >

              <MarkButton
                event={buttonEvent!}
                text={el}
                index={i}
                onClick={() => handleAnswer(el)}
              />

              <span className ='audiogame_answer_index' >[{i+1}]</span>
            </div>
          ))}
        </div>

        <div className="audiogame_next">
          {!showCorrectAnswer &&
              <Button
                buttonType='secondary'
                text='Не знаю'
                onClick={goNextHandler}
              />
          }

          {showCorrectAnswer &&
              <Button
                buttonType='secondary'
                text='Дальше'
                onClick={goNextHandler}
              />
          }

          <span className ='audiogame_answer_index' >[ _ ] </span>

        </div>
      </div>

      <PlaySoundEffect
        playEvent={playSoundItem!}
      />
      <ReactTooltip/>
    </div>

  );
};
