import { useSelector } from 'react-redux';

import React from 'react';

import WordCard from './WordCard';

import './WordsList.pcss';

import Card from '../ui/Card/Card';

import type { Word } from '@/model/app-types';
import type { RootState } from '@/store/store';

interface IWordsList {
  words: Word[];
}

const WordsList = React.memo(({ words }: IWordsList): JSX.Element => {
  const userWordsState = useSelector((state:RootState) => state.userWords);

  const countAllLeranedWords = () => words.reduce((acc, curr) => {
    const thisWordIsInUserWords =  userWordsState.userWords.find(w=>w.optional.wordId === curr.id && w.difficulty !== 'new' );
    if(thisWordIsInUserWords) {
      return acc + 1;
    }
    return acc;
  }, 0);
  const markedWordsNumber = countAllLeranedWords();
  const listIsDone = markedWordsNumber === words.length && markedWordsNumber > 0;

  console.log('LIST', markedWordsNumber);

  return (
    <ul className='words-list'>
      {listIsDone && <span className='list-done'>DONE</span>}
      {words.map(word => {
        /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/
        const id = word.id ? word.id : word._id;
        return (
          <li key={id} className="words-list-item">
            <Card>
              <WordCard word={word}/>
            </Card>
          </li>
        );
      })}
    </ul>
  );
},
);
export default WordsList;
