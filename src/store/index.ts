import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { useDispatch } from "react-redux";
import { api } from "./services/api";
import loginSlice from "./slices/loginSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    login: loginSlice,
  },
  // 中间件
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export default store;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
