import { RootState } from "@/types/store";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Toast } from "antd-mobile";
import loginApi from "@/store/services/loginApi";
import { customHistory } from "./history";
import { clearToken, getToken } from "./token";
import { login, logoutAction } from "@/store/slices/loginSlice";

// 类型断言将error缩小到FetchBaseQueryError
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

// 类型断言将error缩小到{message:string}
export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof (error as any).message === "string"
  );
}

export const baseUrl = "http://toutiao.itheima.net/v1_0";

const fetchQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders(header, { endpoint, getState }) {
    // 获取 store 当中的 token
    const {
      login: { token },
    } = getState() as RootState;

    if (endpoint !== "login" && token) {
      header.set("Authorization", `Bearer ${token}`);
    }

    return header;
  },
});

export const fetchQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extarOption) => {
  let result = await fetchQuery(args, api, extarOption);

  if (result.error?.status === 401) {
    try {
      // 获取refresh_token
      let refresh_token = getToken().refresh_token;
      if (!refresh_token) {
        // 如果没有 refresh_token 则直接走catch内的逻辑
        await Promise.reject(result.error);
      }

      // 发送请求重新获取token
      let res = await api.dispatch(
        loginApi.endpoints.refreshToken.initiate("")
      );

      if ("data" in res) {
        // 如果返回值成功
        let token = res.data.data.token;
        // 重新将token存在本地
        const tokens = {
          token,
          refresh_token,
        };
        // 重新存储token
        api.dispatch(login({ tokens }));

        // 重新执行原来的请求
        return fetchQueryWithReauth(args, api, extarOption);
      }

      // 如果请求出错 走catch内的回调
      await Promise.reject(result.error);
    } catch (e) {
      Toast.show({
        content: "登录超时，请重新登录",
        duration: 1000,
        afterClose: () => {
          // 清除缓存
          clearToken();
          // 清除内存
          api.dispatch(logoutAction());
          // 路由跳转到 登录 页 将当前的pathname作为state参数传给登录页
          customHistory.replace("/login", {
            from: customHistory.location.pathname,
          });
        },
      });
      return result;
    }
  }

  if (result.error?.data) {
    // 提示错误信息
    if (isErrorWithMessage(result.error.data)) {
      Toast.show({
        content: result.error.data.message,
        duration: 1000,
      });
    } else {
      Toast.show({
        content: "网络错误，请重试",
        duration: 1000,
      });
    }
  }
  return result;
};
