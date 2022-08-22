import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/layout/Layout';
import AuthPage from './pages/AuthPage';
import DictionaryPage from './pages/Dictionary/DictionaryPage';
import DifficultWords from './pages/Dictionary/DifficultWords';
import LearnedWords from './pages/Dictionary/LearnedWords';
import Progress from './pages/Dictionary/Progress';
import Statistics from './pages/Dictionary/Statistics';
import GameAudio from './pages/Games/GameAudio';
import GameSprint from './pages/Games/GameSprint';
import GamesPage from './pages/Games/GamesPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import TextbookPage from './pages/TextbookPage';

import type { RootState } from './store/store';

const App = (): JSX.Element => {
  const authState = useSelector((state: RootState) => state.authentication);
  const { isLoggedIn } = authState;
  // console.log('APP', 'isLoggedIn', isLoggedIn, user);
  // console.log('token:', token);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/textbook" element={<TextbookPage />}>
          <Route
            path="dictionary"
            element={isLoggedIn ? <DictionaryPage /> : <Navigate to="/textbook" />}
          >
            <Route path="difficult" element={<DifficultWords />} />
            <Route path="learned" element={<LearnedWords />} />
            <Route path="progress" element={<Progress />} />
            <Route path="statistics" element={<Statistics />} />
          </Route>
        </Route>
        <Route path="/games" element={<GamesPage />}>
          <Route path="audio" element={<GameAudio />} />
          <Route path="sprint" element={<GameSprint />} />
        </Route>
        <Route path="/auth" element={!isLoggedIn ? <AuthPage /> : <Navigate to="/profile" />} />
        <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};
export default App;
