import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

interface IIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const getIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await getIngredientsApi();
      dispatch(setIngredients(res));
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.ingredients = action.payload;
    }
  },
  selectors: {
    ingredientsSelector: (state: IIngredientsState) => state.ingredients,
    loadingSelector: (state: IIngredientsState) => state.isLoading,
    errorSelector: (state: IIngredientsState) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export const { setIngredients } = ingredientsSlice.actions;
export const { ingredientsSelector, loadingSelector, errorSelector } =
  ingredientsSlice.selectors;
