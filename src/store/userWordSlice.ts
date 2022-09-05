import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import * as apiUsersWords from '../model/api-userWords';

import type { UserWord } from '@/model/app-types';

type UserWordsState = {
  userWords: UserWord []; status:'loading' | 'idle';
};

export const fetchUserWords = createAsyncThunk<UserWord [], {userId:string; token:string}>(
  'userWords/fetchUserWordsStatus',
  async (params:{userId:string; token:string}) => {
    const response = await apiUsersWords.getUserWords(params.userId, params.token);
    return response as UserWord [];
  },
);

const retrieveUsersWordsFromLocalStorage = ():UserWord [] => {
  const storedUserWords = localStorage.getItem('userWords');
  if (storedUserWords) {
    return JSON.parse(storedUserWords) as UserWord [];
  }
  return [];
};

const initialState: UserWordsState= {
  userWords: retrieveUsersWordsFromLocalStorage(),
  status:'idle',
};

const userWordsSlice = createSlice({
  name: 'userWords',
  initialState,
  reducers:{
    addUserWord:(state, action:PayloadAction<UserWord>) => {
      const { wordId } = action.payload.optional;
      const existedUserWordIndex = state.userWords.findIndex(w=>w.optional.wordId === wordId);
      if(existedUserWordIndex>-1){
        state.userWords.splice(existedUserWordIndex, 1, action.payload);
      }else{
        state.userWords.push(action.payload);
      }
    },

    deleteUserWord:(state, action: PayloadAction<{deletedWordId:string}>) => {
      state.userWords =
      state.userWords.filter(w => w.optional.wordId !== action.payload.deletedWordId);
    },
  },

  extraReducers: builder => {
    builder.addCase(fetchUserWords.fulfilled, (state, action) => {
      state.userWords = action.payload || [];
      localStorage.setItem('userWords', JSON.stringify( state.userWords));
    });
  },
});

export const userWordsActions = userWordsSlice.actions; // for subscriber (WordCard, ...)

export default userWordsSlice; // to store.ts
