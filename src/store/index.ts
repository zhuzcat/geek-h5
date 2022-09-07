import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { api } from "./services/api";
import { RootState } from "@/types/store";
import loginSlice from "./slices/loginSlice";
import channelSlice from "./slices/channelSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    login: loginSlice,
    channel: channelSlice,
  },
  // 中间件
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export default store;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
