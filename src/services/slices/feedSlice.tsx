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
  async (_, { dispatch, rejectWithValue }) => {
    const res = await getFeedsApi();
    if (!res.success) {
      return rejectWithValue(res);
    }
    dispatch(setFeed(res));
    return res;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (orderNumber: number, { dispatch, rejectWithValue }) => {
    const res = await getOrderByNumberApi(orderNumber);
    if (!res.success) {
      return rejectWithValue(res);
    }
    dispatch(setViewOrder(res.orders[0]));
    return res.orders[0];
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeed: (state, action: PayloadAction<TFeedsResponse>) => {
      state.feed.orders = action.payload.orders;
      state.feed.total = action.payload.total;
      state.feed.totalToday = action.payload.totalToday;
    },
    setViewOrder: (state, action: PayloadAction<TOrder>) => {
      state.viewOrder = action.payload;
    }
  },
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
      .addCase(getFeed.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch feed';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state) => {
        state.orderRequest = false;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Failed to fetch order';
      });
  }
});

export const { setFeed, setViewOrder } = feedSlice.actions;
export const {
  feedSelector,
  viewOrderSelector,
  isLoadingSelector,
  orderRequestSelector,
  errorSelector
} = feedSlice.selectors;
