import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './store';
import { initialState as constructorInitialState } from './slices/constructorSlice/constructorSlice';
import { initialState as orderInitialState } from './slices/orderSlice/orderSlice';
import { initialState as feedInitialState } from './slices/feedSlice/feedSlice';
import { initialState as userInitialState } from './slices/userSlice/userSlice';
import { initialState as ingredientInitialState } from './slices/ingredientSlice/ingredientSlice';

describe('Redux Store', () => {
  // Проверяем, что rootReducer содержит все необходимые слайсы
  it('должен содержать все необходимые слайсы', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    // Проверяем наличие всех слайсов в состоянии
    expect(state).toHaveProperty('constructorBurger');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('ingredient');

    // Проверяем, что слайсы инициализируются с правильными начальными состояниями
    expect(state.constructorBurger).toEqual(constructorInitialState);
    expect(state.order).toEqual(orderInitialState);
    expect(state.feed).toEqual(feedInitialState);
    expect(state.user).toEqual(userInitialState);
    expect(state.ingredient).toEqual(ingredientInitialState);
  });

  // Проверяем, что store создается без ошибок
  it('должен создаваться без ошибок', () => {
    expect(() => {
      configureStore({
        reducer: rootReducer
      });
    }).not.toThrow();
  });
});
