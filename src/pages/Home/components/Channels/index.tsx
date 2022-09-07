import { useState } from "react";
import { useTypedSelector, useAppDispatch } from "@/store";
import {
  useGetAllChannelsQuery,
  useGetChannelsQuery,
  useDelChannelMutation,
  useAddChannelMutation,
} from "@/store/services/channelApi";
import Icon from "@/components/Icon";
import classNames from "classnames";
import styles from "./index.module.scss";
import { setActiveChannel } from "@/store/slices/channelSlice";
import { Channel } from "@/types/data";
import { Toast } from "antd-mobile";

// 设置props类型
type Props = {
  onCancel: () => void;
};

const Channels = ({ onCancel }: Props) => {
  // 获取dispatch方法
  const dispatch = useAppDispatch();

  // 获取删除我的频道的触发器
  const [delChannel] = useDelChannelMutation();
  // 获取添加频道的触发器
  const [addChannel] = useAddChannelMutation();

  // 获取频道列表
  useGetAllChannelsQuery("");
  const { data: userChannelData, isSuccess } = useGetChannelsQuery("");

  // 去除undefined的情况
  const userChannels = isSuccess ? userChannelData.channels : [];
  const { restChannel, activeChannel } = useTypedSelector(
    (state) => state.channel
  );

  // 设置 我的频道 的状态更换标识符
  const [isEdit, setIsEdit] = useState(false);

  // 切换 我的频道 的状态
  const onChangeEdit = () => {
    setIsEdit((prevState) => !prevState);
  };

  // 点击 我的频道 的回调
  const toggleChannel = async (key: number) => {
    if (!isEdit) {
      // 如果不是编辑状态 就切换到选中的频道
      dispatch(setActiveChannel(key));
      onCancel();
    } else {
      // 在频道为推荐和频道长度小于4的时候直接不做操作
      if (key === 0) return;
      if (userChannels.length < 4) return;
      await delChannel(key);
      Toast.show({
        content: "删除成功",
        icon: "success",
      });
    }
  };

  // 点击 可选频道 的回调(添加频道到我的频道)
  const onAddChannel = async (channel: Channel) => {
    await addChannel(channel);
    Toast.show({
      content: "添加成功",
      icon: "success",
    });
  };

  return (
    <div className={styles.root}>
      <div className="channel-header">
        <Icon type="iconbtn_channel_close" onClick={onCancel} />
      </div>
      <div className="channel-content">
        {/* 我的频道 */}
        <div className={classNames("channel-item", isEdit && "edit")}>
          {/* 头部区域 */}
          <div className="channel-item-header">
            <span className="channel-item-title">我的频道</span>
            <span className="channel-item-title-extra">点击进入频道</span>
            <span className="channel-item-edit" onClick={onChangeEdit}>
              {isEdit ? "保存" : "编辑"}
            </span>
          </div>
          {/* 内容区域 */}
          <div className="channel-list">
            {userChannels.map((channel) => {
              return (
                <span
                  className={classNames(
                    "channel-list-item",
                    channel.id + "" === activeChannel && "selected"
                  )}
                  key={channel.id}
                  onClick={() => toggleChannel(channel.id)}
                >
                  {channel.name}
                  {channel.id !== 0 && <Icon type="iconbtn_tag_close" />}
                </span>
              );
            })}
          </div>
        </div>

        {/* 可选频道 */}
        <div className="channel-item">
          {/* 头部 */}
          <div className="channel-item-header">
            <span className="channel-item-title">可选频道</span>
            <span className="channel-item-title-extra">点击添加频道</span>
          </div>
          {/* 内容区域 */}
          <div className="channel-list">
            {restChannel.map((channel) => {
              return (
                <span
                  className="channel-list-item"
                  key={channel.id}
                  onClick={() => onAddChannel(channel)}
                >
                  + {channel.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channels;
