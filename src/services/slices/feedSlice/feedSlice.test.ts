import { initialState, feedSlice, getFeeds } from './feedSlice';
import { TOrder } from '@utils-types';

const reducer = feedSlice.reducer;

describe('Feed Slice', () => {
  // Тестовые данные
  const mockOrders: TOrder[] = [
    {
      _id: 'order1',
      status: 'done',
      name: 'Test Order 1',
      createdAt: '2024-03-20T12:00:00.000Z',
      updatedAt: '2024-03-20T12:00:00.000Z',
      number: 12345,
      ingredients: ['ingredient1', 'ingredient2']
    },
    {
      _id: 'order2',
      status: 'pending',
      name: 'Test Order 2',
      createdAt: '2024-03-20T13:00:00.000Z',
      updatedAt: '2024-03-20T13:00:00.000Z',
      number: 12346,
      ingredients: ['ingredient3', 'ingredient4']
    }
  ];

  // Тест начального состояния
  it('должен вернуть начальное состояние', () => {
    expect(initialState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: null
    });
  });

  // Тест асинхронных экшенов
  describe('getFeeds', () => {
    it('должен обработать pending состояние', () => {
      const action = getFeeds.pending('');
      const result = reducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должен обработать rejected состояние', () => {
      const error = 'Test error';
      const action = getFeeds.rejected(new Error(error), '');
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe(error);
    });

    it('должен обработать fulfilled состояние', () => {
      const action = getFeeds.fulfilled(
        {
          success: true,
          orders: mockOrders,
          total: 100,
          totalToday: 10
        },
        ''
      );
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.orders).toEqual(mockOrders);
      expect(result.total).toBe(100);
      expect(result.totalToday).toBe(10);
    });
  });

  // Тест селекторов
  describe('selectors', () => {
    it('должен вернуть состояние через getFeedState', () => {
      const state = {
        feed: {
          ...initialState,
          orders: mockOrders,
          total: 100,
          totalToday: 10
        }
      };

      const result = feedSlice.selectors.getFeedState(state);

      expect(result).toEqual(state.feed);
    });
  });
});
