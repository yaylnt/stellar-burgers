import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  TFeedsResponse
} from '../../utils/burger-api';
import { TOrder } from '@utils-types';

interface IFeedState {
  feed: {
    orders: TOrder[];
    total: number;
    totalToday: number;
  };
  viewOrder: TOrder | null;
  orderRequest: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: IFeedState = {
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  viewOrder: null,
  orderRequest: false,
  isLoading: false,
  error: null
};

export const getFeed = createAsyncThunk(
  'feed/getFeed',
  async (_, { rejectWithValue }) => {
    const res = await getFeedsApi();
    if (!res.success) {
      return rejectWithValue(res);
    }
    return res;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (orderNumber: number, { rejectWithValue }) => {
    const res = await getOrderByNumberApi(orderNumber);
    if (!res.success) {
      return rejectWithValue(res);
    }
    return res.orders[0];
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    feedSelector: (state) => state.feed,
    viewOrderSelector: (state) => state.viewOrder,
    isLoadingSelector: (state) => state.isLoading,
    orderRequestSelector: (state) => state.orderRequest,
    errorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getFeed.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.isLoading = false;
          state.feed.orders = action.payload.orders;
          state.feed.total = action.payload.total;
          state.feed.totalToday = action.payload.totalToday;
        }
      )
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch feed';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(
        getOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.viewOrder = action.payload;
        }
      )
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Failed to fetch order';
      });
  }
});

export const {
  feedSelector,
  viewOrderSelector,
  isLoadingSelector,
  orderRequestSelector,
  errorSelector
} = feedSlice.selectors;
