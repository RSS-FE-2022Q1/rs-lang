import { configureStore } from '@reduxjs/toolkit';

import authenticationSlice from './authSlice'; // authSlice.ts -> export default authSlice;
import userStatsSlice from './userStatsSlice';
import userWordsSlice from './userWordSlice';

export const store = configureStore({
  reducer: {
    authentication: authenticationSlice.reducer,
    userWords: userWordsSlice.reducer,
    userStats: userStatsSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
