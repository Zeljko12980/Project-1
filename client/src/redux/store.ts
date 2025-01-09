import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import productReducer from "./features/productSlice";
import homeReducer from "./features/homeSlice";
import orderReducer from "./features/orderSlice";
import reviewReducer from './features/reviewSlice';
import wishReducer from './features/wishSlice';
import notifyReducer from './features/notificationSlice';

// Configure the Redux store with reducers
export const store = configureStore({
  reducer: {
    cartReducer,
    productReducer,
    authReducer,
    homeReducer,
    orderReducer,
     reviewReducer,
     wishReducer,
     notifyReducer
     
  },
});

// Define RootState type from the store's state
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type from the store's dispatch function
export type AppDispatch = typeof store.dispatch;

// Custom hooks (optional but recommended) for easier usage of typed dispatch and selector in your components

import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
