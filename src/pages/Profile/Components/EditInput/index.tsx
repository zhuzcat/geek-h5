import { useState, useEffect } from "react";
import { NavBar, Input, TextArea } from "antd-mobile";
import styles from "./index.module.scss";

// 组件 props 的类型
type Props = {
  type: "" | "name" | "intro";
  value: string;
  visible: boolean;
  onProfileUpdate: (type: "intro" | "name", value: string) => void;
  onClose: () => void;
};

const EditInput = ({
  type,
  value,
  onClose,
  visible,
  onProfileUpdate,
}: Props) => {
  // 判断编辑类型
  const isEditName = type === "name";

  // 创建inputValue
  const [inputValue, setInputValue] = useState<Props["value"]>(value);

  // 在useEffect中将value的值赋给inputValue
  useEffect(() => {
    if (visible) {
      // 如果在之前修改过value的值 则将新的值赋给value
      value !== inputValue && setInputValue(value);
    }
  }, [visible]);

  // 提交更新
  const submitUpdate = () => {
    if (type === "") return;
    onProfileUpdate(type, inputValue);
  };

  return (
    <div className={styles.root}>
      <NavBar
        onBack={onClose}
        children={`编辑${isEditName ? "昵称" : "简介"}`}
        right={
          <span className="submit-button" onClick={submitUpdate}>
            提交
          </span>
        }
      />
      <div className="edit-input">
        {isEditName ? (
          <div className="input-wrap">
            <Input
              placeholder="请输入昵称"
              value={inputValue}
              onChange={(value) => setInputValue(value)}
            />
          </div>
        ) : (
          <TextArea
            className="textarea"
            placeholder="请输入内容"
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            rows={4}
            maxLength={100}
            showCount
          />
        )}
      </div>
    </div>
  );
};

export default EditInput;
