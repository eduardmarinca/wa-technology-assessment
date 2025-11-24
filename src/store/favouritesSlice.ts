import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavouritesState {
  favouriteIds: string[];
}

const initialState: FavouritesState = {
  favouriteIds: [],
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<string>) => {
      if (!state.favouriteIds.includes(action.payload)) {
        state.favouriteIds.push(action.payload);
      }
    },
    removeFavourite: (state, action: PayloadAction<string>) => {
      state.favouriteIds = state.favouriteIds.filter((id) => id !== action.payload);
    },
    clearFavourites: (state) => {
      state.favouriteIds = [];
    },
  },
});

export const { addFavourite, removeFavourite, clearFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;
