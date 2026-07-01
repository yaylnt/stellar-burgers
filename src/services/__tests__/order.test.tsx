import orderReducer, {
  orderBurger,
  initialState,
  addIngredient,
  removeIngridient,
  moveIngredientUp,
  moveIngredientDown,
  sendOrderRequest,
  clearOrderModal
} from '../slices/orderSlice';
import { expect, it, describe, jest } from '@jest/globals';
import { TConstructorIngredient } from '@utils-types';

const mockIngredient: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: '',
  image_mobile: '',
  image_large: '',
  id: 'test-id-1'
};

const ingredients: TConstructorIngredient[] = [
  mockIngredient,
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: '',
    image_mobile: '',
    image_large: '',
    id: 'test-id-2'
  }
];

const mockOrderData = {
  _id: 'test-id-1',
  status: 'done',
  name: 'Test Order',
  owner: {
    email: 'test@example.com',
    name: 'Test User',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 12345,
  price: 988
};

describe('Тест редьюсера слайса order', () => {
  it('Тест addIngredient', () => {
    const sliceInitialState = {
      ...initialState
    };

    const newState = orderReducer(
      sliceInitialState,
      addIngredient(mockIngredient)
    );
    expect(newState.constructorItems.ingredients).toEqual([
      {
        ...mockIngredient,
        id: expect.any(String)
      }
    ]);
  });

  it('Тест removeIngridient', () => {
    const sliceInitialState = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [mockIngredient]
      }
    };

    const bunId = sliceInitialState.constructorItems.ingredients[0].id;

    const newState = orderReducer(sliceInitialState, removeIngridient(bunId));
    expect(newState.constructorItems.ingredients).toEqual([]);
  });

  it('Тест moveIngredientUp', () => {
    const sliceInitialState = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: ingredients
      }
    };

    const newState = orderReducer(sliceInitialState, moveIngredientUp(1));
    expect(newState.constructorItems.ingredients).toEqual([
      ingredients[1],
      ingredients[0]
    ]);
  });

  it('Тест moveIngredientDown', () => {
    const sliceInitialState = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: ingredients
      }
    };

    const newState = orderReducer(sliceInitialState, moveIngredientDown(0));
    expect(newState.constructorItems.ingredients).toEqual([
      ingredients[1],
      ingredients[0]
    ]);
  });

  it('Тест sendOrderRequest', () => {
    const sliceInitialState = {
      ...initialState
    };

    const newState = orderReducer(sliceInitialState, sendOrderRequest());
    expect(newState.orderRequest).toBe(true);
  });

  it('Тест clearOrderModal', () => {
    const sliceInitialState = {
      ...initialState,
      orderModalData: mockOrderData
    };

    const newState = orderReducer(sliceInitialState, clearOrderModal());
    expect(newState.orderModalData).toEqual(null);
  });

  it('Тест orderBurger.pending: очищает ошибки и включает isLoading', async () => {
    const sliceInitialState = {
      ...initialState,
      error: 'test error'
    };

    const mockOrder = ['643d69a5c3f7b9001cfa0941', '643d69a5c3f7b9001cfa093e'];

    const action = orderBurger.pending('requestId', mockOrder);
    const newState = orderReducer(sliceInitialState, action);

    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('Тест orderBurger.fulfilled', async () => {
    const sliceInitialState = {
      ...initialState,
      isLoading: true
    };

    const action = orderBurger.fulfilled(mockOrderData, 'requestId', [
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093e'
    ]);
    const newState = orderReducer(sliceInitialState, action);

    expect(newState.isLoading).toBe(false);
    expect(newState.orderModalData).toEqual(mockOrderData);
    expect(newState.orderRequest).toBe(false);
    expect(newState.constructorItems).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('Тест orderBurger.rejected', async () => {
    const sliceInitialState = {
      ...initialState,
      isLoading: true
    };

    const action = orderBurger.rejected(null, 'requestId', [
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093e'
    ]);
    const newState = orderReducer(sliceInitialState, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBeDefined();
  });

  it('Тест несуществующего экшена', () => {
    const newState = orderReducer(undefined, { type: 'nonExistentAction' });
    expect(newState).toEqual(initialState);
  });
});
