import { useState } from "react";
import { CenterPopup, Image, List, Toast } from "antd-mobile";
import { LeftOutline } from "antd-mobile-icons";
import { useTypedSelector } from "@/store";
import {
  useDislikeArticleMutation,
  useReportArticleMutation,
} from "@/store/services/articleApi";
import Icon from "../Icon";
import classNames from "classnames";
import dayjs from "dayjs";
// 相对时间插件
import relativeTime from "dayjs/plugin/relativeTime";
// 国际化 - 中文
import "dayjs/locale/zh-cn";
import { firstAction, secondAction, ReportAction } from "@/config/reportType";
import styles from "./index.module.scss";

// 启用相对时间
dayjs.extend(relativeTime);
// 启用中文
dayjs.locale("zh-cn");

type Props = {
  art_id: string;
  type: 0 | 1 | 3;
  title: string;
  aut_name: string;
  comm_count: number;
  pubdate: string;
  channelId: number;
  images?: string[];
};

type ReportType = {
  actions: ReportAction;
  showBack: boolean;
};

const ArticleItem = ({
  art_id,
  type,
  title,
  aut_name,
  comm_count,
  pubdate,
  images,
  channelId,
}: Props) => {
  // 获取举报和不喜欢的触发器
  const [dislikeArticle] = useDislikeArticleMutation();
  const [reportArticle] = useReportArticleMutation();

  // 获取token
  const token = useTypedSelector((state) => state.login.token);

  // 控制反馈弹出框的显示
  const [visible, setVisible] = useState<boolean>(false);

  // 控制反馈相关的信息
  const [report, setReport] = useState<ReportType>({
    actions: [],
    showBack: false,
  });

  // 显示反馈弹出框
  const onShowReport = () => {
    // 设置反馈框的列表
    setReport({
      actions: firstAction,
      showBack: false,
    });
    // 展示反馈框
    setVisible(true);
  };

  // 对文章进行反馈操作
  const onReportItem = async (name: string, value: undefined | number) => {
    if (name === "不感兴趣") {
      await dislikeArticle({ target: art_id, channelId });
      // 提示信息
      Toast.show({
        content: "操作成功",
        icon: "success",
        afterClose: () => {
          setVisible(false);
        },
      });
    } else if (value === undefined) {
      setReport({
        actions: secondAction,
        showBack: true,
      });
    } else {
      await reportArticle({ target: art_id, channelId, value });
      // 提示信息
      Toast.show({
        content: "举报成功",
        icon: "success",
        afterClose: () => {
          setVisible(false);
        },
      });
    }
  };

  return (
    <div className={styles.root}>
      <div
        className={classNames(
          "article-content",
          type === 3 && "t3",
          type === 0 && "none-mt"
        )}
      >
        <h3>{title}</h3>
        {/* 判断是否有图片 并渲染图片 图片使用懒加载 */}
        {type !== 0 && (
          <div className="article-imgs">
            {images?.map((item, index) => {
              return (
                <div key={index} className="article-img-wrapper">
                  <Image
                    lazy
                    fit="cover"
                    src={item}
                    style={{
                      "--width": "110px",
                      "--height": "75px",
                    }}
                    alt=""
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* 底部信息 */}
      <div className={classNames("article-info", type === 0 && "none-mt")}>
        <span>{aut_name}</span>
        <span>{comm_count} 评论</span>
        <span>{dayjs().from(dayjs(pubdate))}</span>
        {token && (
          <span className="close">
            <Icon type="iconbtn_essay_close" onClick={onShowReport} />
          </span>
        )}
      </div>
      <CenterPopup visible={visible} onMaskClick={() => setVisible(false)}>
        <div className="article-item-popup">
          <List
            mode="card"
            header={
              report.showBack && (
                <div className="back-button" onClick={onShowReport}>
                  <LeftOutline />
                  返回
                </div>
              )
            }
          >
            {report.actions.map((action) => {
              return (
                <List.Item
                  key={action.name}
                  onClick={() => {
                    onReportItem(action.name, action.value);
                  }}
                >
                  {action.name}
                </List.Item>
              );
            })}
          </List>
        </div>
      </CenterPopup>
    </div>
  );
};

export default ArticleItem;
