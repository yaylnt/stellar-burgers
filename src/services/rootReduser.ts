import { userSlice } from './slices/userSlice';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { orderSlice } from './slices/orderSlice';
import { feedSlice } from './slices/feedSlice';
import { combineSlices } from '@reduxjs/toolkit';

const rootReducer = combineSlices({
  user: userSlice.reducer,
  ingredients: ingredientsSlice.reducer,
  orders: orderSlice.reducer,
  feed: feedSlice.reducer
});

export default rootReducer;
