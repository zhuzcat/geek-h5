import { useEffect, useState } from "react";
import { InfiniteScroll, PullToRefresh } from "antd-mobile";
import { PullStatus } from "antd-mobile/es/components/pull-to-refresh";
import ArticleItem from "@/components/ArticleItem";
import { useAppDispatch } from "@/store";
import { api } from "@/store/services/api";
import {
  useLazyGetArticleListQuery,
  useGetArticleListQuery,
} from "@/store/services/articleApi";
import styles from "./index.module.scss";

type Props = {
  channelId: number;
};

const ArticleList = ({ channelId }: Props) => {
  // 获取dispatch方法
  const dispatch = useAppDispatch();

  // 获取当前id的列表数据
  const { data, isSuccess } = useGetArticleListQuery(channelId);

  // 获取查询数据的触发器 和结果
  const [getArticleList] = useLazyGetArticleListQuery();

  // 获取pre_timestamp
  let pre_timestamp = data ? data.data.pre_timestamp : null;

  // 加载更多文章
  const loadMore = async () => {
    if (pre_timestamp) {
      await getArticleList({
        channel_id: channelId,
        pre_timestamp: parseInt(pre_timestamp),
      });
    }
  };

  // 下拉刷新文章
  const onRefreshList = async () => {
    dispatch(
      api.util.invalidateTags([{ type: "Article", id: channelId + "" }])
    );
  };

  // 自定义下路刷新的文字提示
  const statusRecord: Record<PullStatus, string> = {
    pulling: "用力拉",
    canRelease: "松开吧",
    refreshing: "玩命加载中...",
    complete: "好啦",
  };

  const hasMore = pre_timestamp !== null;

  return (
    <div className={styles.root}>
      <PullToRefresh
        onRefresh={onRefreshList}
        renderText={(status) => <div>{statusRecord[status]}</div>}
      >
        {isSuccess &&
          data.data.results.map((item, index) => {
            // 获取文章列表的数据
            const {
              art_id,
              title,
              aut_name,
              comm_count,
              pubdate,
              cover: { type, images },
            } = item;

            const articleData = {
              art_id,
              title,
              aut_name,
              comm_count,
              pubdate,
              type,
              images,
              channelId,
            };

            return (
              <div key={art_id} className="article-item">
                <ArticleItem {...articleData} />
              </div>
            );
          })}
      </PullToRefresh>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={50} />
    </div>
  );
};

export default ArticleList;
