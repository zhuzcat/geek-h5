import store from "@/store";
import { ThunkAction } from "@reduxjs/toolkit";
import { Token } from "./data";

export type RootState = ReturnType<typeof store.getState>;

export type RootThunkAction = ThunkAction<void, RootState, unknown, RootAction>;

export type RootAction = LoginAction;

export type LoginAction = {
  type: "login/loginToken";
  payload: Token;
};
