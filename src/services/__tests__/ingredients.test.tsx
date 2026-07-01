import ingredientsReducer, { getIngredients, initialState } from '../slices/ingredientsSlice';
import { TIngredient } from '../../utils/types';
import { expect, it, describe, jest } from '@jest/globals';

describe('Тест редьюсера слайса ingredients', () => {

  it('Тест getIngredients.pending: должен включать isLoading и сбрасывать error', () => {
    const prevState = {
      ...initialState,
      error: 'test error'
    };

    const action = getIngredients.pending('requestId', undefined);
    const state = ingredientsReducer(prevState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Тест getIngredients.fulfilled: записывает ингредиенты и выключает isLoading', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Тестовая булка',
        type: 'bun',
        proteins: 1,
        fat: 1,
        carbohydrates: 1,
        calories: 1,
        price: 100,
        image: '',
        image_mobile: '',
        image_large: ''
      }
    ];

    const prevState = {
      ...initialState,
      isLoading: true
    };

    const action = getIngredients.fulfilled(
      mockIngredients,
      'requestId',
      undefined
    );
    const state = ingredientsReducer(prevState, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('Тест getIngredients.rejected: выключает isLoading и записывает error', () => {
    const prevState = {
      ...initialState,
      isLoading: true
    };

    const action = getIngredients.rejected(null, 'requestId', undefined);
    const state = ingredientsReducer(prevState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeDefined();
  });

  it('Тест несуществующего экшена', () => {
    const state = ingredientsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });
});
