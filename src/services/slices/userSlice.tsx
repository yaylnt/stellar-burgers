import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  updateUserApi,
  getUserApi,
  getOrdersApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { TOrder, TUser } from '../../utils/types';

interface IUserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: TUser | null;
  orders: TOrder[];
  error: string | null;
}

const initialState: IUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  isLoading: false,
  user: null,
  orders: [],
  error: null
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    { email, password, name }: TRegisterData,
    { dispatch, rejectWithValue }
  ) => {
    const registrationData = await registerUserApi({ email, password, name });
    if (!registrationData.success) {
      return rejectWithValue(registrationData);
    }
    setCookie('accessToken', registrationData.accessToken);
    localStorage.setItem('refreshToken', registrationData.refreshToken);
    dispatch(setUser(registrationData.user));
    return registrationData.user;
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: TLoginData, { dispatch, rejectWithValue }) => {
    const loginData = await loginUserApi({ email, password });
    if (!loginData.success) {
      return rejectWithValue(loginData);
    }
    setCookie('accessToken', loginData.accessToken);
    localStorage.setItem('refreshToken', loginData.refreshToken);
    dispatch(setUser(loginData.user));
    return loginData.user;
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue, dispatch }) =>
    logoutApi()
      .then((res) => {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch(clearUser());
        return res;
      })
      .catch((error) => rejectWithValue(error))
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { dispatch, rejectWithValue }) => {
    const res = await getUserApi();
    if (!res.success) {
      return rejectWithValue(res);
    }
    dispatch(setUser(res.user));
    return res;
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (user: Partial<TRegisterData>, { dispatch, rejectWithValue }) => {
    const updatedUserData = await updateUserApi(user);
    if (!updatedUserData.success) {
      return rejectWithValue(updatedUserData);
    }
    dispatch(setUser(updatedUserData.user));
    return updatedUserData.user;
  }
);

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await getOrdersApi();
      dispatch(setUserOrders(res));
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setUserOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
    }
  },
  selectors: {
    authCheckedSelector: (state: IUserState) => state.isAuthChecked,
    authenticatedSelector: (state: IUserState) => state.isAuthenticated,
    userDataSelector: (state: IUserState) => state.user,
    loadingSelector: (state: IUserState) => state.isLoading,
    userOrdersSelector: (state: IUserState) => state.orders,
    errorSelector: (state: IUserState) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.error.message || 'Ошибка входа';
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка обновления данных пользователя';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка выхода';
      })
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка получения заказов пользователя';
      });
  }
});

export const { setUser, clearUser, setUserOrders } = userSlice.actions;

export const {
  authCheckedSelector,
  authenticatedSelector,
  userDataSelector,
  loadingSelector,
  errorSelector,
  userOrdersSelector
} = userSlice.selectors;
