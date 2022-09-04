import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Token } from "@/types/data";
import loginApi from "../services/loginApi";
import { clearToken, getToken, setToken } from "@/utils/token";

const loginSlice = createSlice({
  name: "loginState",
  // 初始化状态
  initialState: (): Token => {
    return getToken();
  },
  reducers: {
    // 登录
    login(state, action: PayloadAction<{ tokens: Token }>) {
      // 设置本地缓存
      setToken(action.payload.tokens);
      // 修改state
      state.token = action.payload.tokens.token;
      state.refresh_token = action.payload.tokens.refresh_token;
    },
    // 退出登录
    logout(state) {
      // 清除本地缓存
      clearToken();
      // state初始化
      state.refresh_token = "";
      state.token = "";
    },
  },
  extraReducers: (build) => {
    build.addMatcher(
      loginApi.endpoints.login.matchFulfilled,
      (state, action) => {
        // 将 token 存储到 state 中
        state.token = action.payload.data.token;
        state.refresh_token = action.payload.data.refresh_token;
        // 将 token 存储到 localStorage中
        setToken({
          token: state.token,
          refresh_token: state.refresh_token,
        });
      }
    );
  },
});

export const { logout, login } = loginSlice.actions;

export default loginSlice.reducer;
