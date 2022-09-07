import { Channel, ChannelList, UserChannelResponse } from "@/types/data";
import { RootState } from "@/types/store";
import { FetchArgs } from "@reduxjs/toolkit/dist/query";
import { api } from "./api";

const CHANNEL_KEYS = "geel_h5_channels";
const channelApi = api.injectEndpoints({
  endpoints: (build) => ({
    // 获取用户频道
    getChannels: build.query<ChannelList, string>({
      // 跳过baseQuery直接通过queryFn发送请求
      async queryFn(args, api, extarOption, baseQuery) {
        // 获取token
        let token = (api.getState() as RootState).login.token;

        // 如果是登录状态则直接获取
        if (token) {
          const res = await baseQuery("user/channels");

          return {
            data: (res.data as UserChannelResponse).data,
          };
        } else {
          // 如果未登录 则先从本地获取 然后本地没有发送请求
          let localChannels: [] = JSON.parse(
            localStorage.getItem(CHANNEL_KEYS) || "[]"
          );

          if (localChannels.length > 0) {
            return {
              data: {
                channels: localChannels,
              },
            };
          } else {
            const res = await baseQuery("user/channels");

            const channels = (res.data as UserChannelResponse).data.channels;
            localStorage.setItem(CHANNEL_KEYS, JSON.stringify(channels));

            return {
              data: {
                channels: channels || [],
              },
            };
          }
        }
      },

      // 设置缓存 tag
      providesTags: [{ type: "Channel", id: "userchannels" }],
    }),

    // 获取所有的频道
    getAllChannels: build.query<UserChannelResponse, string>({
      query: () => "channels",
      providesTags: [{ type: "Channel", id: "allchannels" }],
    }),

    // 删除我的频道
    delChannel: build.mutation<string, number>({
      // 删除用户频道
      async queryFn(arg: number, api, extraOptions, baseQuery) {
        // 获取token
        let token = (api.getState() as RootState).login.token;

        if (token) {
          // 设置fetchArg
          const fetchArg: FetchArgs = {
            url: `/user/channels/${arg}`,
            method: "DELETE",
          };
          // 如果是登录状态 则发送请求删除
          await baseQuery(fetchArg);
        } else {
          // 未登录则通过本地进行删除
          const localChannels = JSON.parse(
            localStorage.getItem(CHANNEL_KEYS) || "[]"
          ) as Channel[];

          const userChannels = localChannels.filter((item) => {
            return item.id !== arg;
          });

          localStorage.setItem(CHANNEL_KEYS, JSON.stringify(userChannels));
        }

        return {
          data: "success",
        };
      },

      // 设置失效缓存 tag
      invalidatesTags: [{ type: "Channel" }],
    }),

    // 添加我的频道
    addChannel: build.mutation<string, Channel>({
      async queryFn(arg, api, extraOptions, baseQuery) {
        // 获取token
        let token = (api.getState() as RootState).login.token;

        // 判断是否登录
        if (token) {
          // 设置fetchArg
          const fetchArg: FetchArgs = {
            url: "/user/channels",
            method: "PATCH",
            body: {
              channels: [arg],
            },
          };
          // 直接发送请求
          await baseQuery(fetchArg);
        } else {
          // 操作本地的 我的频道
          const localChannels = JSON.parse(
            localStorage.getItem(CHANNEL_KEYS) || "[]"
          ) as Channel[];

          const userChannels = [...localChannels, arg];

          // 存储到本地
          localStorage.setItem(CHANNEL_KEYS, JSON.stringify(userChannels));
        }
        return { data: "success" };
      },

      // 设置失效tag
      invalidatesTags: [{ type: "Channel" }],
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useGetAllChannelsQuery,
  useDelChannelMutation,
  useAddChannelMutation,
} = channelApi;
export default channelApi;
