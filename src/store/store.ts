import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './reducers/cart-reducer';
import categoriesReducer from './reducers/categories-reducer';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    categories: categoriesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;