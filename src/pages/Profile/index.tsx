import { Image, Grid } from "antd-mobile";
import { Link } from "react-router-dom";
import { RightOutline } from "antd-mobile-icons";
import Icon from "@/components/Icon";
import { useGetUserQuery } from "@/store/services/profileApi";
import style from "./index.module.scss";

const Profile = () => {
  const { data } = useGetUserQuery("");

  return (
    <div className={style.root}>
      <div className="user-profile">
        <div className="info">
          <div className="info-avatar">
            <Image
              width={"12vw"}
              height={"12vw"}
              src={data?.photo}
              fit="cover"
              style={{ borderRadius: "50%" }}
            />
          </div>
          <div className="info-name">
            <h3>{data?.name}</h3>
          </div>
          <div className="info-edit">
            <Link to="/profile/edit">
              个人信息
              <RightOutline />
            </Link>
          </div>
        </div>
        <Grid columns={4} className="user-social-info">
          <Grid.Item>
            <p>{data?.art_count}</p>
            <p>动态</p>
          </Grid.Item>
          <Grid.Item>
            <p>{data?.follow_count}</p>
            <p>关注</p>
          </Grid.Item>
          <Grid.Item>
            <p>{data?.fans_count}</p>
            <p>分数</p>
          </Grid.Item>
          <Grid.Item>
            <p>{data?.like_count}</p>
            <p>被赞</p>
          </Grid.Item>
        </Grid>
        <div className="user-link">
          <Grid columns={4}>
            <Grid.Item>
              <div className="tt-icon">
                <Icon type="iconbtn_mymessages" />
              </div>
              <p>消息通知</p>
            </Grid.Item>
            <Grid.Item>
              <div className="tt-icon">
                <Icon type="iconbtn_mycollect" />
              </div>
              <p>我的收藏</p>
            </Grid.Item>
            <Grid.Item>
              <div className="tt-icon">
                <Icon type="iconbtn_history1" />
              </div>
              <p>阅读历史</p>
            </Grid.Item>
            <Grid.Item>
              <div className="tt-icon">
                <Icon type="iconbtn_myworks" />
              </div>
              <p>我的作品</p>
            </Grid.Item>
          </Grid>
        </div>
        <div className="more-link">
          <p className="title">更多服务</p>
          <Grid columns={4}>
            <Grid.Item>
              <div className="tt-icon">
                <Icon type="iconbtn_feedback" />
              </div>
              <p>用户反馈</p>
            </Grid.Item>
            <Grid.Item>
              <div className="tt-icon">
                <Icon type="iconbtn_xiaozhitongxue" />
              </div>
              <p>小智同学</p>
            </Grid.Item>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Profile;
