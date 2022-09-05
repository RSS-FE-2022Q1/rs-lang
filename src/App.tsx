import { ReactLocation, Router, Navigate, Outlet } from '@tanstack/react-location';
import { useDispatch, useSelector } from 'react-redux';

import { useEffect } from 'react';

import TextbookGroup from './components/Textbook/TextbookGroup';
import { Footer } from './components/layout/Footer/Footer';
import Layout from './components/layout/Layout';
import MainNavigation from './components/layout/MainNavigation';
import Spinner from './components/ui/Spinner';
import * as apiUsers from './model/api-users';
import * as api from './model/api-words';
import AuthPage from './pages/AuthPage';
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
import { authActions } from './store/authSlice';
import { fetchUsersStats } from './store/userStatsSlice';
import { fetchUserWords } from './store/userWordSlice';

import type { LocationGenerics } from './model/app-types';
import type { RootState, AppDispatch } from './store/store';
import type { Route } from '@tanstack/react-location';

const LOGIN_EXPIRATION_TIME = 4 * 3600 * 1000; // 4 hours
const REFRESH_LOGIN_TIME = 3 * 3600 * 1000;

const isLoginExpired = () => {
  const currentTime = new Date().getTime();
  const token = localStorage.getItem('token');
  const lastLoginDate = localStorage.getItem('authDate');
  let lastLoginTime = 0;
  if(typeof lastLoginDate === 'string'){
    lastLoginTime = new Date(lastLoginDate).getTime();
  }
  if(token && (currentTime - lastLoginTime) > LOGIN_EXPIRATION_TIME){
    return true;
  }
  return false;
};

const App = ():JSX.Element => {
  console.log('APP');
  const authState = useSelector((state: RootState) => state.authentication);
  const { isLoggedIn } = authState;
  const dispatch = useDispatch<AppDispatch>();

  if(isLoggedIn){
    setTimeout(() =>{
      apiUsers.getNewTokensForTheUser(authState.userId, authState.refreshToken)
        .then(res=>{
          if(res && res.token && res.refreshToken){
            const refreshData = {
              newToken:res.token,
              refreshToken:res.refreshToken,
              newAuthDate: new Date().toISOString(),
            };
            dispatch(authActions.refreshTokens(refreshData));
            window.location.reload();
          }
        })
        .catch(() => {});
    }, REFRESH_LOGIN_TIME);
  }

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
      element: <DictionaryPage/>,
      children: [
        { path: 'difficult', element: <DifficultWords /> },
        { path: 'learned', element: <LearnedWords /> },
        { path: 'progress', element: <Progress /> },
      ],
    },
    // {
    //   path: '/debug',
    //   element: isLoggedIn ? <DebugPage /> : <Navigate to="/debug" />,
    // },
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
    { path: '/auth', element: <AuthPage /> },
    { path: '/profile', element: <ProfilePage /> },
    { path: '*', element: <Navigate to="/" /> },
  ];

  useEffect(() => {

    if(isLoginExpired()){
      dispatch(authActions.logout());
      window.location.reload();
    }

    const userData = { userId:authState.userId, token:authState.token };

    const  getUsersWords = async () => {
      await dispatch(fetchUserWords(userData));
    };

    const getUserStatistic = async () => {
      await dispatch(fetchUsersStats(userData));
    };

    getUsersWords().catch(() => {});
    getUserStatistic().catch(() => {});

  }, [authState.token, authState.userId, dispatch]);

  return (
    <Router
      location={location}
      routes={appRoutes}
      defaultPendingElement={<Spinner />}
      defaultPendingMs={10}
    >
      <MainNavigation />

      <Layout >
        <Outlet />
      </Layout>

      <Footer/>
    </Router>
  );
};
export default App;
