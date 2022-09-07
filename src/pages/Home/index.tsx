import { useState } from "react";
import { Tabs, Popup } from "antd-mobile";
import { useAppDispatch, useTypedSelector } from "@/store";
import { setActiveChannel } from "@/store/slices/channelSlice";
import { useGetChannelsQuery } from "@/store/services/channelApi";
import Icon from "@/components/Icon";
import ArticleList from "./components/ArticleList";
import Channels from "./components/Channels";
import styles from "./index.module.scss";

const Home = () => {
  // 设置频道管理显示隐藏的标识
  const [visible, setVisible] = useState<boolean>(false);

  // 获取dispatch方法
  const dispatch = useAppDispatch();

  // 获取频道列表
  const { data, isSuccess } = useGetChannelsQuery("");
  // data在最开始是undefined
  const channels = isSuccess ? data.channels : [];

  // 获取activeKey
  const { activeChannel } = useTypedSelector((state) => state.channel);

  // 切换选中频道
  const toggleChannel = (key: string) => {
    // 分发action 更改activeKey
    dispatch(setActiveChannel(parseInt(key)));
  };

  // 关闭频道管理
  const onCloseChannels = () => {
    setVisible(false);
  };

  return (
    <div className={styles.root}>
      {channels.length > 0 && (
        <Tabs
          activeKey={activeChannel}
          onChange={toggleChannel}
          className="tabs"
          activeLineMode="fixed"
        >
          {channels.map((channel) => {
            return (
              <Tabs.Tab key={channel.id} title={channel.name}>
                <ArticleList channelId={channel.id} />
              </Tabs.Tab>
            );
          })}
        </Tabs>
      )}

      <div className="tabs-operation">
        <Icon type="iconbtn_search" />
        <Icon type="iconbtn_channel" onClick={() => setVisible(true)} />
      </div>

      <Popup
        visible={visible}
        onMaskClick={onCloseChannels}
        position="left"
        className="channels-popup"
      >
        <Channels onCancel={onCloseChannels} />
      </Popup>
    </div>
  );
};

export default Home;
