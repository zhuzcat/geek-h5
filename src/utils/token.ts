import { Token } from "@/types/data";

// 使用常量来存储token
const TOKEN_KEY = "geek_access_token";

// 创建 获取 token
export const getToken = (): Token => {
  return JSON.parse(
    localStorage.getItem(TOKEN_KEY) || '{ "token": "", "refresh_token": "" }'
  );
};

// 创建 设置 token
export const setToken = (token: Token) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
};

// 创建 清除 token
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// 创建 判断登录
export const isAuth = () => getToken().token;
