import styles from "./index.module.scss";

// 定义props类型
type Props = {
  type: "" | "photo" | "gender";
  onClose: () => void;
  onHandleUpdate: (type: "photo" | "gender", value: string) => void;
};

// 定义展示的列表
const genderList = [
  { text: "男", value: "0" },
  { text: "女", value: "1" },
];
const photoList = [
  { text: "拍照", value: "picture" },
  { text: "本地选择", value: "local" },
];

const EditList = ({ type, onClose, onHandleUpdate }: Props) => {
  // 点击列表项的回调
  const onItemClick = (value: string) => {
    // 修改个人资料
    if (type === "") return;
    onHandleUpdate(type, value);
  };

  // 获取当前的列表信息
  const list = type === "photo" ? photoList : genderList;
  return (
    <div className={styles.root}>
      {list.map((item) => (
        <div
          className="list-item"
          key={item.text}
          onClick={() => onItemClick(item.value)}
        >
          {item.text}
        </div>
      ))}
      <div className="list-item" onClick={onClose}>
        取消
      </div>
    </div>
  );
};

export default EditList;
