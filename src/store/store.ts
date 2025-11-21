import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import favouritesReducer from './favouritesSlice';
import { api } from './api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favourites: favouritesReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
