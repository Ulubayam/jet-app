import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { 
  Restaurant, 
  RestaurantState
} from "./types";

const initialState: RestaurantState = {
  list: [],
  loading: false,
  error: null,
  currentPostcode: null,
  currentAreaName: null
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    fetchRestaurantsRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
      state.currentPostcode = action.payload;
    },
    fetchRestaurantsSuccess: (state, action: PayloadAction<Restaurant[]>) => {
      state.loading = false;
      state.list = action.payload;
      state.error = null;
    },
    fetchRestaurantsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.list = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchRestaurantsRequest,
  fetchRestaurantsSuccess,
  fetchRestaurantsFailure,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
