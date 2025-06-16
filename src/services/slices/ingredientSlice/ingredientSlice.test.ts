import { initialState, ingredientSlice, getIngredients } from './ingredientSlice';
import { TIngredient } from '@utils-types';

const reducer = ingredientSlice.reducer;

describe('Ingredient Slice', () => {
  // Тестовые данные
  const mockIngredients: TIngredient[] = [
    {
      _id: 'ingredient1',
      name: 'Test Ingredient 1',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 100,
      image: 'test1.jpg',
      image_mobile: 'test1-mobile.jpg',
      image_large: 'test1-large.jpg'
    },
    {
      _id: 'ingredient2',
      name: 'Test Ingredient 2',
      type: 'sauce',
      proteins: 5,
      fat: 5,
      carbohydrates: 5,
      calories: 50,
      price: 50,
      image: 'test2.jpg',
      image_mobile: 'test2-mobile.jpg',
      image_large: 'test2-large.jpg'
    }
  ];

  // Тест начального состояния
  it('должен вернуть начальное состояние', () => {
    expect(initialState).toEqual({
      ingredients: [],
      loading: false,
      error: null
    });
  });

  // Тест асинхронных экшенов
  describe('getIngredients', () => {
    it('должен обработать pending состояние', () => {
      const action = getIngredients.pending('');
      const result = reducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должен обработать rejected состояние', () => {
      const error = 'Test error';
      const action = getIngredients.rejected(new Error(error), '');
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe(error);
    });

    it('должен обработать fulfilled состояние', () => {
      const action = getIngredients.fulfilled(mockIngredients, '');
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.ingredients).toEqual(mockIngredients);
    });
  });

  // Тест селекторов
  describe('selectors', () => {
    it('должен вернуть состояние через getIngredientState', () => {
      const state = {
        ingredient: {
          ...initialState,
          ingredients: mockIngredients
        }
      };

      const result = ingredientSlice.selectors.getIngredientState(state);

      expect(result).toEqual(state.ingredient);
    });
  });
});
