import { api } from "./api";
import { baseUrl } from "@/utils/http";
import { LoginResponse, RefreshTokenResponse } from "@/types/data";
import { RootState } from "@/types/store";

const loginApi = api.injectEndpoints({
  endpoints: (build) => ({
    // 登录 端点
    login: build.mutation<LoginResponse, object>({
      query(body) {
        return {
          url: "authorizations",
          body,
          method: "post",
        };
      },
    }),
    // 获取验证码 端点
    getCode: build.mutation({
      query(mobile: string) {
        return {
          url: `/sms/codes/${mobile}`,
          method: "get",
        };
      },
    }),
    // 刷新token
    refreshToken: build.mutation<RefreshTokenResponse, string>({
      // 通过queryFn走单独的发送请求的方式
      async queryFn(args, api, extarOption) {
        // 获取refresh_token
        let refresh_token = (api.getState() as RootState).login.refresh_token;

        // 发送请求获取新的token
        const response = await fetch(`${baseUrl}/authorizations`, {
          headers: {
            Authorization: `Bearer ${refresh_token}`,
          },
          method: "PUT",
        });

        // 处理结果
        const res = await response.json();

        // 返回endpoint固定格式的返回值
        if (res.data) {
          return {
            data: res,
          };
        } else {
          return {
            error: res,
          };
        }
      },
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const { useLoginMutation, useGetCodeMutation } = loginApi;

export default loginApi;
