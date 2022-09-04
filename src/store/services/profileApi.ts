import { api } from "./api";
import {
  User,
  ProfileResponse,
  UserProfile,
  UserProfileResponse,
  UserPhotoResponse,
} from "@/types/data";

const profileApi = api.injectEndpoints({
  endpoints: (build) => ({
    // 获取用户信息
    getUser: build.query<User, string>({
      query: () => "/user",
      // 设置缓存 tag
      providesTags: [{ type: "Profile", id: "user" }],
      // 对返回的响应进行拆包
      transformResponse: (response: ProfileResponse) => {
        return response.data;
      },
      // 设置缓存保留时间
      keepUnusedDataFor: 1800,
    }),

    // 获取用户详情信息
    getUserProfile: build.query<UserProfile, string>({
      query: () => "user/profile",
      // 设置缓存tag
      providesTags: [{ type: "Profile", id: "userprofile" }],
      // 对响应的返回值进行拆包解析
      transformResponse: (response: UserProfileResponse) => {
        return response.data;
      },
      // 设置缓存保留时间
      keepUnusedDataFor: 1800,
    }),

    // 修改 用户个人资料
    updateUserProfile: build.mutation({
      query: (body: Partial<UserProfile>) => ({
        url: "user/profile",
        method: "PATCH",
        body,
      }),
      // 设置无效tag
      invalidatesTags: (result, error, arg) => {
        if (arg.name || arg.photo) {
          return [{ type: "Profile" }];
        }
        return [{ type: "Profile", id: "userprofile" }];
      },
    }),

    // 修改 头像
    updateUserPhoto: build.mutation<UserPhotoResponse, object>({
      query: (body: FormData) => ({
        url: "/user/photo",
        body,
        method: "PATCH",
      }),
      // 为 修改头像 设置请求生命周期
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // 获取返回数据
          let {
            data: {
              data: { photo },
            },
          } = await queryFulfilled;

          dispatch(profileApi.endpoints.updateUserProfile.initiate({ photo }));
        } catch (e) {}
      },
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserPhotoMutation,
} = profileApi;
