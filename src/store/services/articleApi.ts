import { ArticleListResponse } from "@/types/data";
import { api } from "./api";

type DisLikeArg = {
  channelId: number;
  target: string;
};

type ReportArg = DisLikeArg & { value: number };

const articleApi = api.injectEndpoints({
  endpoints: (build) => ({
    // 获取新的推荐列表
    getArticleList: build.query<
      ArticleListResponse,
      number | { channel_id: number; pre_timestamp: number }
    >({
      query(arg) {
        // 判断参数的类型 如果是纯number则是获取一个新的推荐列表
        if (typeof arg === "object") {
          return {
            url: "/articles",
            params: {
              channel_id: arg.channel_id,
              timestamp: arg.pre_timestamp,
            },
          };
        } else {
          return {
            url: "/articles",
            params: {
              channel_id: arg,
              timestamp: Date.now(),
            },
          };
        }
      },
      // 设置缓存tag
      providesTags: (result, error, arg) => {
        if (typeof arg === "object") {
          return [{ type: "Article", id: arg.channel_id + "loadmore" }];
        } else {
          return [{ type: "Article", id: arg + "" }];
        }
      },
      // 整合之前的数据
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        // 判断是否是第一次
        if (typeof arg === "object") {
          const id = arg.channel_id;

          dispatch(
            articleApi.util.updateQueryData("getArticleList", id, (draft) => {
              draft.data.pre_timestamp = data.data.pre_timestamp;
              draft.data.results.push(...data.data.results);
            })
          );
        }
      },
    }),

    // 不喜欢文章
    dislikeArticle: build.mutation({
      query(arg: DisLikeArg) {
        return {
          url: "article/dislikes",
          method: "POST",
          body: {
            target: arg.target,
          },
        };
      },
      // 在发送请求成功后 还需要将不喜欢的过滤掉
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          // 过滤调不喜欢的文章
          dispatch(
            articleApi.util.updateQueryData(
              "getArticleList",
              arg.channelId,
              (draft) => {
                draft.data.results = draft.data.results.filter((result) => {
                  return result.art_id !== arg.target;
                });
              }
            )
          );
        } catch (error) {}
      },
    }),

    // 举报文章
    reportArticle: build.mutation({
      query(arg: ReportArg) {
        return {
          url: "article/reports",
          method: "POST",
          body: {
            target: arg.target,
            value: arg.value,
          },
        };
      },
      // 请求发送成功后 过滤掉举报的文章
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          // 过滤掉举报的文章
          dispatch(
            articleApi.util.updateQueryData(
              "getArticleList",
              arg.channelId,
              (draft) => {
                draft.data.results = draft.data.results.filter((result) => {
                  return result.art_id !== arg.target;
                });
              }
            )
          );
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useLazyGetArticleListQuery,
  useGetArticleListQuery,
  useDislikeArticleMutation,
  useReportArticleMutation,
} = articleApi;

export default articleApi;
