import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  nanoid
} from '@reduxjs/toolkit';
import { orderBurgerApi, TNewOrder } from '../../utils/burger-api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

interface IOrdersState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  isLoading: boolean;
  orderRequest: boolean;
  orderModalData: TNewOrder | null;
  error: string | null;
}

export const initialState: IOrdersState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  isLoading: false,
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const orderBurger = createAsyncThunk(
  'orders/orderBurger',
  async (ingredients: string[], { rejectWithValue }) => {
    const res = await orderBurgerApi(ingredients);
    if (!res.success) {
      return rejectWithValue(res);
    }
    return res.order;
  }
);

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngridient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (i) => i.id !== action.payload
        );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      state.constructorItems.ingredients.splice(
        action.payload,
        0,
        state.constructorItems.ingredients.splice(action.payload - 1, 1)[0]
      );
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      state.constructorItems.ingredients.splice(
        action.payload,
        0,
        state.constructorItems.ingredients.splice(action.payload + 1, 1)[0]
      );
    },
    sendOrderRequest: (state) => {
      state.orderRequest = true;
    },
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    constructorItemsSelector: (state: IOrdersState) => state.constructorItems,
    loadingSelector: (state: IOrdersState) => state.isLoading,
    orderRequestSelector: (state: IOrdersState) => state.orderRequest,
    orderDataSelector: (state: IOrdersState) => state.orderModalData,
    errorSelector: (state: IOrdersState) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        orderBurger.fulfilled,
        (state, action: PayloadAction<TNewOrder>) => {
          state.isLoading = false;
          state.orderModalData = action.payload;
          state.orderRequest = false;
          state.constructorItems = {
            bun: null,
            ingredients: []
          };
        }
      )
      .addCase(orderBurger.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка размещения заказа';
        state.orderRequest = false;
      });
  }
});

export const {
  addIngredient,
  removeIngridient,
  moveIngredientUp,
  moveIngredientDown,
  sendOrderRequest,
  clearOrderModal
} = orderSlice.actions;

export const {
  constructorItemsSelector,
  loadingSelector,
  orderRequestSelector,
  orderDataSelector,
  errorSelector
} = orderSlice.selectors;

export default orderSlice.reducer;
