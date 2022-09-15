import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { ProgressWordMap } from '../model/app-types';

import { getUserStatistic } from '@/model/api-statistic';

type LearnedGroups = {
  [group:string]: boolean[]; // learned pages
};

interface IUserProgress {
  userProgress: ProgressWordMap;
  userLearnedPages: LearnedGroups;
}

const initialState:IUserProgress = {
  userProgress: {},
  userLearnedPages: {},
};

export const fetchUsersStats = createAsyncThunk(
  'userStats/fetchUsersStatsStatus',
  async (params:{userId:string; token:string}) => {
    const currentStatistic = await getUserStatistic(params.userId, params.token);
    return currentStatistic;
  },
);

const userStatsSlice = createSlice({
  name:'userStats',
  initialState,
  reducers:{
    initializeGroupLearningStatus:(state, action:PayloadAction<{group:string; pagesLearningStatus:boolean[]}>) => {
      const { group, pagesLearningStatus } = action.payload;
      state.userLearnedPages[group] = pagesLearningStatus;
    },
    addLearnedPage:(state, action:PayloadAction<{group: string; learnedPageNumber:string}>) => {
      const  { group, learnedPageNumber } = action.payload;
      // console.log(group, learnedPageNumber);
      if(state.userLearnedPages[group]){
        state.userLearnedPages[group][learnedPageNumber] = true;
      }
    },

  },
  // extraReducers:builder => {
  //   builder.addCase(fetchUsersStats.fulfilled, (state, action) => {
  //     const stats = action.payload?.optional.gamesWordsProgress;
  //     // console.log('stats', stats);
  //     if(stats){
  //       state.userProgress = stats;
  //     }
  //   });
  // },
});

export const  userStatsActions = userStatsSlice.actions; // for TextbookGroup.tsx
export default userStatsSlice; // for store.ts
