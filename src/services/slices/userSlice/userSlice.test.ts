import userSlice, {
  getUser,
  getOrdersAll,
  initialState,
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
  getUserState
} from './userSlice';
import { TUser } from '@utils-types';

describe('User Slice', () => {
  // Тестовые данные
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockRegisterData = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  };

  const mockLoginData = {
    email: 'test@example.com',
    password: 'password123'
  };

  // Тест начального состояния
  it('должен вернуть начальное состояние', () => {
    expect(initialState).toEqual({
      request: false,
      error: null,
      response: null,
      registerData: null,
      userData: null,
      isAuthChecked: false,
      isAuthenticated: false,
      loginUserRequest: false,
      userOrders: []
    });
  });

  // Тест асинхронных экшенов
  describe('registerUser', () => {
    it('должен обработать pending состояние', () => {
      const action = registerUser.pending('', mockRegisterData);
      const result = userSlice(initialState, action);

      expect(result.request).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должен обработать rejected состояние', () => {
      const error = 'Test error';
      const action = registerUser.rejected(new Error(error), '', mockRegisterData);
      const result = userSlice(initialState, action);

      expect(result.request).toBe(false);
      expect(result.error).toBe(error);
    });

    it('должен обработать fulfilled состояние', () => {
      const action = registerUser.fulfilled(
        {
          success: true,
          user: mockUser,
          accessToken: 'token',
          refreshToken: 'refresh'
        },
        '',
        mockRegisterData
      );
      const result = userSlice(initialState, action);

      expect(result.request).toBe(false);
      expect(result.error).toBeNull();
      expect(result.userData).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
    });
  });

  describe('loginUser', () => {
    it('должен обработать pending состояние', () => {
      const action = loginUser.pending('', mockLoginData);
      const result = userSlice(initialState, action);

      expect(result.loginUserRequest).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должен обработать rejected состояние', () => {
      const error = 'Test error';
      const action = loginUser.rejected(new Error(error), '', mockLoginData);
      const result = userSlice(initialState, action);

      expect(result.loginUserRequest).toBe(false);
      expect(result.error).toBe(error);
      expect(result.isAuthenticated).toBe(false);
    });

    it('должен обработать fulfilled состояние', () => {
      const action = loginUser.fulfilled(
        {
          success: true,
          user: mockUser,
          accessToken: 'token',
          refreshToken: 'refresh'
        },
        '',
        mockLoginData
      );
      const result = userSlice(initialState, action);

      expect(result.loginUserRequest).toBe(false);
      expect(result.error).toBeNull();
      expect(result.userData).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
    });
  });

  describe('logoutUser', () => {
    it('должен обработать pending состояние', () => {
      const state = {
        ...initialState,
        isAuthenticated: true,
        userData: mockUser
      };
      const action = logoutUser.pending('', undefined);
      const result = userSlice(state, action);

      expect(result.request).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должен обработать rejected состояние', () => {
      const error = 'Test error';
      const action = logoutUser.rejected(new Error(error), '', undefined);
      const result = userSlice(initialState, action);

      expect(result.request).toBe(false);
      expect(result.error).toBe(error);
    });

    it('должен обработать fulfilled состояние', () => {
      const state = {
        ...initialState,
        isAuthenticated: true,
        userData: mockUser
      };
      const action = logoutUser.fulfilled(undefined, '', undefined);
      const result = userSlice(state, action);

      expect(result.request).toBe(false);
      expect(result.error).toBeNull();
      expect(result.userData).toBeNull();
      expect(result.isAuthenticated).toBe(false);
    });
  });

  // Тест селекторов
  describe('selectors', () => {
    it('должен вернуть состояние через getUserState', () => {
      const state = {
        user: {
          ...initialState,
          userData: mockUser,
          isAuthenticated: true
        }
      };

      const result = getUserState(state);

      expect(result).toEqual(state.user);
    });
  });
});
