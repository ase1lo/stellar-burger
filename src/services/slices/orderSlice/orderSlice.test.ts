import { initialState, orderSlice, getOrderByNumber } from './orderSlice';
import { TOrder } from '@utils-types';

const reducer = orderSlice.reducer;

describe('Order Slice', () => {
  // Тестовые данные
  const mockOrder: TOrder = {
    _id: 'order1',
    status: 'done',
    name: 'Test Order',
    createdAt: '2024-03-20T12:00:00.000Z',
    updatedAt: '2024-03-20T12:00:00.000Z',
    number: 12345,
    ingredients: ['ingredient1', 'ingredient2']
  };

  // Тест начального состояния
  it('должен вернуть начальное состояние', () => {
    expect(initialState).toEqual({
      orders: [],
      orderByNumberResponse: null,
      request: false,
      responseOrder: null,
      error: null
    });
  });

  // Тест асинхронных экшенов
  describe('getOrderByNumber', () => {
    it('должен обработать pending состояние', () => {
      const action = getOrderByNumber.pending('', 12345);
      const result = reducer(initialState, action);

      expect(result.request).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должен обработать rejected состояние', () => {
      const error = 'Test error';
      const action = getOrderByNumber.rejected(new Error(error), '', 12345);
      const result = reducer(initialState, action);

      expect(result.request).toBe(false);
      expect(result.error).toBe(error);
      expect(result.orderByNumberResponse).toBeNull();
    });

    it('должен обработать fulfilled состояние', () => {
      const action = getOrderByNumber.fulfilled(
        { success: true, orders: [mockOrder] },
        '',
        12345
      );
      const result = reducer(initialState, action);

      expect(result.request).toBe(false);
      expect(result.error).toBeNull();
      expect(result.orderByNumberResponse).toEqual(mockOrder);
    });
  });

  // Тест селекторов
  describe('selectors', () => {
    it('должен вернуть состояние через getOrderState', () => {
      const state = {
        order: {
          ...initialState,
          orderByNumberResponse: mockOrder
        }
      };

      const result = orderSlice.selectors.getOrderState(state);

      expect(result).toEqual(state.order);
    });
  });
});
