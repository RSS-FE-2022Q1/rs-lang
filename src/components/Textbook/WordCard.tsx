/* eslint-disable no-underscore-dangle */
import './WordCard.pcss';
import { CheckIcon, PuzzleIcon } from '@heroicons/react/solid';
import htmlParser from 'html-react-parser';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import React from 'react';

import * as apiUsersWords from '../../model/api-userWords';
import { setUserWordDifficulty } from '../../model/api-userWords';
import { PlayAudio } from '../PlayAudio/PlayAudio';

import { addWordsToStatistic, emptyWordStats } from '@/model/api-statistic';
import { API_ENDPOINT } from '@/model/api-words';
import type { UserWord, Word } from '@/model/app-types';
import { RootState } from '@/store/store';
import { userWordsActions } from '@/store/userWordSlice';

type TSVGIcon = {
  icon:(props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

interface IWordCard {
  word: Word;
}

const WordCard = React.memo((props:IWordCard): JSX.Element => {
  // console.log('CARD');
  const { word:wordObj } = props;
  const {
    id,
    _id:ID,
    // group,
    // page,
    word,
    image,
    audio,
    audioMeaning,
    audioExample,
    textMeaning,
    textExample,
    transcription,
    wordTranslate,
    textMeaningTranslate,
    textExampleTranslate,
  } = wordObj;
  const renderedWordId = id || ID;

  const authState = useSelector((state:RootState) => state.authentication);
  const userWordsState = useSelector((state:RootState) => state.userWords);

  let wordProgress;
  if(renderedWordId){
    wordProgress = userWordsState.userWords.find(
      el=>el.optional.wordId === renderedWordId)?.optional.statistic;

    // console.log('userProgress', userStatsState.userProgress);
    // console.log('wordProgress', wordProgress, renderedWordId);
  }

  const wordInUsersWords = userWordsState.userWords.
    find(w => (w.optional.wordId === (renderedWordId)));

  // console.log('wordInUsersWords', wordInUsersWords);
  const dispatch = useDispatch();

  const audioSources = [audio, audioMeaning, audioExample].map(source=>`${API_ENDPOINT}/${source}`);
  const wordAudio = audioSources[0];
  const additionalAudio = audioSources.slice(1);

  const hardWordIcon:TSVGIcon = { icon:PuzzleIcon };
  const learnedWord:TSVGIcon = { icon:CheckIcon };

  const handleHardWord = async () => {
    // one more click on same button -> remove the word from user's

    if(wordInUsersWords?.difficulty === 'hard'){

      await apiUsersWords.
        deleteUserWord(authState.userId, wordInUsersWords.optional.wordId, authState.token)
        .catch(() => {});
      dispatch(userWordsActions.deleteUserWord({ deletedWordId:wordInUsersWords.optional.wordId }));

    } else if(renderedWordId){
      await setUserWordDifficulty(authState.userId, authState.token, renderedWordId, 'hard').catch(() => {});

      const newWord:UserWord = {
        difficulty: 'hard',
        optional:{
          statistic: emptyWordStats(),
          wordId: renderedWordId,
          theWord: wordObj.word,
          postDate: new Date().toLocaleDateString('en-US'),
        },
      };

      dispatch(userWordsActions.addUserWord(newWord));
    }

  };

  const handleLearnedWord = async () => {

    // one more click on same button -> remove the word from user's
    if(wordInUsersWords?.difficulty === 'learned'){

      await apiUsersWords.
        deleteUserWord(authState.userId, wordInUsersWords.optional.wordId, authState.token)
        .catch(() => {});
      dispatch(userWordsActions.deleteUserWord({ deletedWordId:wordInUsersWords.optional.wordId }));

    } else if(renderedWordId){
      await setUserWordDifficulty(authState.userId, authState.token, renderedWordId, 'learned').catch(() => {});
      await addWordsToStatistic(authState.userId, authState.token);

      const newWord:UserWord = {
        difficulty: 'learned',
        optional:{
          statistic: emptyWordStats(),
          wordId:renderedWordId,
          theWord: wordObj.word,
          postDate: new Date().toLocaleDateString('en-US'),
        },
      };

      dispatch(userWordsActions.addUserWord(newWord));
    }

  };

  const controlHardBtnClasses = () => {
    const baseClass = 'usual hard';
    if(wordInUsersWords && wordInUsersWords.difficulty === 'hard') {
      return `${baseClass} active-hard`;
    }
    return baseClass;
  };

  const controlLearnedBtnClasses = () => {
    const baseClass = 'usual learned';
    if(wordInUsersWords && wordInUsersWords.difficulty === 'learned') {
      return `${baseClass} active-learned`;
    }
    return baseClass;
  };

  const lastGuessBadgeClasses = `word-card-progress-badge ${wordProgress?.last ? 'text-green-400' : 'text-yellow-600'}`;

  return (
    <article className="word-card">
      <div className='word-card-essence'>

        <div>
          <p>
            {word} <span>{transcription}</span>
          </p>
          <p>
            {wordTranslate}
          </p>
        </div>

        <PlayAudio source={wordAudio} additionalSources={additionalAudio} type='single-button'/>

        { authState.isLoggedIn && (
          <div className='word-card-controls'>
            <button className={controlHardBtnClasses()}
              type='button'
              onClick={() => {handleHardWord().catch(() => {});}}
              data-tip="Добавить в сложные или удалить из сложных">
              <hardWordIcon.icon/>
            </button>
            <button className={controlLearnedBtnClasses()}
              type='button'
              onClick={()=>{handleLearnedWord().catch(()=>{});}}
              data-tip="Добавить в изученные или удалить из изученных">
              <learnedWord.icon/>
            </button>

          </div>
        )}
      </div>

      <div className='word-card-image-wrapper'>
        {authState.isLoggedIn && wordProgress && (
          <div className="word-card-progress">
            <span className="word-card-progress-badge text-green-400" data-tip="Правильных ответов в играх">
              {wordProgress?.guessed}
            </span>
            <span className="word-card-progress-badge text-yellow-600" data-tip="Ошибок">
              {wordProgress?.failed}
            </span>
            <span className={lastGuessBadgeClasses} data-tip="Поледний ответ">
              {wordProgress?.last ? '+' : '-'}
            </span>
          </div>
        )}
        <img src={`${API_ENDPOINT}/${image}`} alt={word} />
      </div>

      <div>
        <hr />
        <p>{htmlParser(textMeaning)}</p>
        <p>{`${textMeaningTranslate}`}</p>
        <hr />
        <p>{htmlParser(textExample)}</p>
        <p>{textExampleTranslate}</p>
      </div>

      <ReactTooltip type='info' delayShow={500}/>

    </article>
  );
});
export default WordCard;
