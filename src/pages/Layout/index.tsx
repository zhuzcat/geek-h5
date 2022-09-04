import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { TabBar } from "antd-mobile";
import Icon from "@/components/Icon";
import styles from "./index.module.scss";

const tabs = [
  { path: "/home", text: "首页", icon: "iconbtn_home" },
  { path: "/home/qs", text: "问答", icon: "iconbtn_qa" },
  { path: "/home/video", text: "视频", icon: "iconbtn_video" },
  { path: "/home/profile", text: "我的", icon: "iconbtn_mine" },
];

const Layout = () => {
  // 路由信息
  const { pathname } = useLocation();

  // navigate
  const navigate = useNavigate();

  // 点击tab路由跳转
  const onTabToggle = (value: string) => {
    navigate(value);
  };

  return (
    <div className={styles.root}>
      <Outlet />
      <TabBar activeKey={pathname} onChange={onTabToggle} className="tab-bar">
        {tabs.map((tab) => (
          <TabBar.Item
            key={tab.path}
            title={tab.text}
            icon={(active) => (
              <Icon
                type={active ? `${tab.icon}_sel` : tab.icon}
                className="tab-bar-item-icon"
              />
            )}
          />
        ))}
      </TabBar>
    </div>
  );
};

export default Layout;
