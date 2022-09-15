import { ClockIcon, PuzzleIcon } from '@heroicons/react/outline';
import { useMatch, useNavigate, Link } from '@tanstack/react-location';
import { useDispatch, useSelector } from 'react-redux';

import { useEffect } from 'react';

import WordsList from './WordsList';

import * as apiWords from '../../model/api-words';
import Pagination from '../Pagination/Pagination';

import type { LocationGenerics } from '@/model/app-types';
import type { RootState } from '@/store/store';
import { userStatsActions } from '@/store/userStatsSlice';

import './TextbookGroup.pcss';

type TSVGIcon = {
  icon:(props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

const TOTAL_WORDS = 3600;
const TOTAL_GROUPS = 6;
const WORDS_PER_PAGE = 20;
const WORDS_PER_GROUP = TOTAL_WORDS / TOTAL_GROUPS;

const TextbookGroup = (): JSX.Element => {

  console.log('GROUP');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStatsState = useSelector((state:RootState) => state.userStats);
  const userWordsState = useSelector((state:RootState) => state.userWords);
  const { data: { words: currentWords }, params } = useMatch<LocationGenerics>();

  let currentPageIsDone = false;

  if(currentWords){
    const countAllLeranedWords = () => currentWords.reduce((acc, curr) => {
      const thisIsUserWord =  userWordsState.userWords.find(w=>w.optional.wordId === curr.id && w.difficulty !=='new');
      if(thisIsUserWord) {
        return acc + 1;
      }
      return acc;
    }, 0);
    // console.log('countAllLeranedWords', countAllLeranedWords());
    currentPageIsDone = countAllLeranedWords() === currentWords.length;
  }

  useEffect(() => {

    // if(params.page === '0'){

    const wordsIdsByPages = async () => {
      let pagesLearningStatus;
      const idOfAllWordsOfThisGroup = await  apiWords.getIdOfAllWordsOfTheGroup(params.group)
        .catch(() => {});
        //  console.log('idOfAllWordsOfThisGroup', idOfAllWordsOfThisGroup);

      if(idOfAllWordsOfThisGroup){
        pagesLearningStatus =   idOfAllWordsOfThisGroup.map(pageWordsIds => {
          if(pageWordsIds){
            const wordsFromThisPageInUsersWords =
               pageWordsIds.filter(id => userWordsState.userWords
                 .find(w => w.optional.wordId === id && w.difficulty !== 'new'));
            return wordsFromThisPageInUsersWords;
          }
          return pageWordsIds;
        });

        if(pagesLearningStatus){
          pagesLearningStatus = pagesLearningStatus.map(pageWordsIds => {
            if(pageWordsIds){
              return pageWordsIds.length;
            }
            return pageWordsIds;
          });
        }
      }
      pagesLearningStatus = pagesLearningStatus?.map(p => p===20);
      // console.log('pagesLearningStatus', pagesLearningStatus);
      if(pagesLearningStatus){
        dispatch( userStatsActions.initializeGroupLearningStatus(
          { group:params.group, pagesLearningStatus }),
        );
        // console.log('userLearnedVolume', userStatsState.userLearnedPages);
      }
      return pagesLearningStatus;
    };

    wordsIdsByPages().catch(() => {});
    // }

  }, [params.page, params.group]);

  const pagesStatus = userStatsState.userLearnedPages[params.group];

  const paginate = (pageNumber: number) => {
    navigate({ to: `/textbook/${params.group}/${pageNumber - 1}` });
  };

  const gamePath = (gameName: string) => {
    let path = `/games/${gameName}`;
    if (params.group) {
      path += `/?group=${params.group}`;
      if (params.page) {
        path += `&page=${params.page}`;
      }
    }
    return path;
  };

  const puzzleIcon:TSVGIcon = { icon:PuzzleIcon };
  const clockIcon:TSVGIcon = { icon:ClockIcon };

  return (
    <section className={`textbook-group ${currentPageIsDone ? 'group-done': ''}`}>
      <div className="textbook-group-controls">
        <Pagination
          totalElements={WORDS_PER_GROUP}
          elementsPerPage={WORDS_PER_PAGE}
          paginate={paginate}
          currentPageNumber = {parseInt(params.page, 10)}
          currentPageIsDone = {currentPageIsDone}
          pagesStatus={pagesStatus}
        />
        {!currentPageIsDone && (
          <div className="textbook-group-games-links">
            <Link to={gamePath('sprint')}>
              <clockIcon.icon/>
              Sprint</Link>
            <Link to={gamePath('audio')}>
              <puzzleIcon.icon/>
              Audio
            </Link>
          </div>
        )}
      </div>

      {currentWords && <WordsList words={currentWords}/>}
    </section>
  );
};

export default TextbookGroup;
