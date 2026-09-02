import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginUser/fulfilled', 'auth/fetchCurrentUser/fulfilled'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

export default store;
