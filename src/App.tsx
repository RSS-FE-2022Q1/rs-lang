import { ReactLocation, Router, Navigate, Outlet } from '@tanstack/react-location';
import { useDispatch, useSelector } from 'react-redux';

import { useEffect } from 'react';

import TextbookGroup from './components/Textbook/TextbookGroup';
import MainNavigation from './components/layout/MainNavigation';
import Spinner from './components/ui/Spinner';
import * as api from './model/api-words';
import AuthPage from './pages/AuthPage';
import DebugPage from './pages/Debug/Debug';
import DictionaryPage from './pages/Dictionary/DictionaryPage';
import DifficultWords from './pages/Dictionary/DifficultWords';
import LearnedWords from './pages/Dictionary/LearnedWords';
import Progress from './pages/Dictionary/Progress';
import GameAudio from './pages/Games/GameAudio';
import GameSprint from './pages/Games/GameSprint';
import GamesPage from './pages/Games/GamesPage';
import { MainPage } from './pages/MainPage/MainPage';
import ProfilePage from './pages/Profile/ProfilePage';
import { TeamPage } from './pages/TeamPage/TeamPage';
import TextbookMainPage from './pages/TextbookMainPage/TextbookMainPage';
import { fetchUserWords } from './store/userWordSlice';

import type { LocationGenerics } from './model/app-types';
import type { RootState, AppDispatch } from './store/store';
import type { Route } from '@tanstack/react-location';

const App = ():JSX.Element => {
  const authState = useSelector((state: RootState) => state.authentication);
  const { isLoggedIn } = authState;
  const dispatch = useDispatch<AppDispatch>();

  const location = new ReactLocation<LocationGenerics>();

  const appRoutes: Route<LocationGenerics>[] = [
    { path: '/', element: <MainPage /> },
    { path: '/team', element: <TeamPage /> },
    {
      path: '/textbook',
      element: <TextbookMainPage />,
      children: [
        {
          path: ':group/:page',
          element: <TextbookGroup />,
          pendingElement: <Spinner />,
          pendingMs: 100,
          loader: async ({ params }) => {
            const currentWords = await api.getWords(params.group, params.page);
            return {
              words: currentWords || undefined,
            };
          },
        },
      ],
    },
    {
      path: '/dictionary',
      element: isLoggedIn ? <DictionaryPage /> : <Navigate to="/textbook" />,
      children: [
        { path: 'difficult', element: <DifficultWords /> },
        { path: 'learned', element: <LearnedWords /> },
        { path: 'progress', element: <Progress /> },
      ],
    },
    {
      path: '/debug',
      element: isLoggedIn ? <DebugPage /> : <Navigate to="/debug" />,
    },
    {
      path: '/games',
      element: <GamesPage />,
      children: [
        { path: 'audio', element: <GameAudio /> },
        {
          path: 'sprint',
          element: <GameSprint />,
        },
      ],
    },
    { path: '/auth', element: !isLoggedIn ? <AuthPage /> : <Navigate to="/profile" /> },
    { path: '/profile', element: isLoggedIn ? <ProfilePage /> : <Navigate to="/auth" /> },
    { path: '*', element: <Navigate to="/" /> },
  ];

  // console.log('APP', 'location', location);
  // console.log('APP', 'appRoutes', appRoutes);
  useEffect(() => {
    const userData = { userId:authState.userId, token:authState.token };
    const  getUsersWords = async () => {
      await dispatch(fetchUserWords(userData));
    };
    getUsersWords().catch(() => {});

  }, [authState.token, authState.userId, dispatch]);

  const testFetch = async () => {
  // await apiUserWords.deleteUserWord(authState.userId, '5e9f5ee35eb9e72bc21b0065', authState.token);
  // const oldWord = await apiUserWords.getUserWordById(authState.userId, '5e9f5ee35eb9e72bc21b0066', authState.token).catch(() => {});
  // const optPrev = oldWord?.optional;
  // if(optPrev){
  //   await apiUserWords
  //     .updateUserWord(authState.userId, authState.token, { difficulty: 'hard', optional:{ ...optPrev, numberOfMistakesSprint: 47 } })
  //     .catch(() => {});
  // }

    // const obtainedWord = await apiUserWords.getUserAggregatedWordById(authState.userId, '5e9f5ee35eb9e72bc21af4a3', authState.token);
    // const oneMore = await apiUserWords.getUserWordById(authState.userId, '5e9f5ee35eb9e72bc21af4a3', authState.token);
    // console.log(obtainedWord, oneMore);
  };
  testFetch().catch(() => {});

  return (
    <Router
      location={location}
      routes={appRoutes}
      defaultPendingElement={<Spinner />}
      defaultPendingMs={10}
    >
      <MainNavigation/>
      <Outlet />
    </Router>
  );
};
export default App;
