import React, { useState, useRef } from "react";
import {
  NavBar,
  List,
  Image,
  Popup,
  Toast,
  DatePicker,
  Dialog,
} from "antd-mobile";
import EditInput from "../Components/EditInput";
import EditList from "../Components/EditList";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserPhotoMutation,
} from "@/store/services/profileApi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useAppDispatch } from "@/store";
import style from "./index.module.scss";
import { logoutAction } from "@/store/slices/loginSlice";

type InputPopup = {
  type: "" | "name" | "intro";
  value: string;
  visible: boolean;
};

type ListPopup = {
  type: "" | "photo" | "gender";
  visible: boolean;
};

const ProfileEdit = () => {
  // 创建 inputpopup 来标识当前 修改 的状态
  const [inputPopup, setInputPopup] = useState<InputPopup>({
    type: "",
    value: "",
    visible: false,
  });

  // 创建 listpopup 来标识当前 修改 的状态
  const [listPopup, setListPopup] = useState<ListPopup>({
    type: "",
    visible: false,
  });

  // 创建 showBirthdayEdit 来标识是否展示生日选择框
  const [showBirthdayEdit, setShowBirthdayEdit] = useState<boolean>(false);

  // 创建上传头像的input的ref
  const fileRef = useRef<HTMLInputElement>(null);

  // 创建navigate方法
  const navigate = useNavigate();

  // 创建dispatch方法
  const dispatch = useAppDispatch();

  // 获取个人信息数据
  const { data } = useGetUserProfileQuery("");

  // 获取修改个人资料的触发器
  const [updateUserProfile] = useUpdateUserProfileMutation();
  // 修改头像的触发器
  const [updateUserPhoto] = useUpdateUserPhotoMutation();

  // 修改个人信息
  const onUpdateProfile = async (
    type: "name" | "intro" | "gender" | "birthday" | "photo",
    value: string
  ) => {
    // 判断修改类型
    if (type === "photo") {
      // 触发 input[type=file] 的点击事件
      fileRef.current?.click();
    } else {
      // 提交信息更改
      await updateUserProfile({ [type]: value });

      Toast.show({
        content: "修改成功",
        duration: 600,
      });

      // 将所有弹出框状态设置为关闭
      onInputPopupHide();
      onListPopupHide();
      setShowBirthdayEdit(false);
    }
  };

  // 上传头像
  const onUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      Toast.show({
        content: "请选择照片",
        duration: 600,
      });
      return;
    }

    // 创建formData对象存储头像
    const formData = new FormData();
    formData.append("photo", e.target.files[0]);

    await updateUserPhoto(formData);

    onListPopupHide();
    Toast.show({
      content: "更新头像成功",
      duration: 600,
    });
  };

  // 修改生日
  const onUpdateBirthday = (value: Date) => {
    // 转换生日的格式
    let birthday = dayjs(value).format("YYYY-MM-DD");
    // 更新生日
    onUpdateProfile("birthday", birthday);
  };

  // inputPopup 弹出框显示
  const onInputPopupShow = (
    type: InputPopup["type"],
    value: InputPopup["value"]
  ) => {
    setInputPopup({
      type,
      value,
      visible: true,
    });
  };

  // inputPopup 隐藏显示框
  const onInputPopupHide = () => {
    setInputPopup({
      type: "",
      value: "",
      visible: false,
    });
  };

  // listPopup 显示弹出框
  const onListPopupShow = (type: ListPopup["type"]) => {
    setListPopup({
      visible: true,
      type,
    });
  };

  // listPopup 隐藏弹出框
  const onListPopupHide = () => {
    setListPopup((prevState) => {
      return { ...prevState, visible: false };
    });
  };

  // 退出登录
  const onLogout = () => {
    // 弹出确认框
    Dialog.show({
      title: "温馨提示",
      content: "您确认要退出登录吗？",
      closeOnAction: true,
      closeOnMaskClick: true,
      actions: [
        [
          {
            key: "cancel",
            text: "取消",
            style: {
              color: "#999",
            },
          },
          {
            key: "confirm",
            text: "确认",
            onClick: () => {
              // 退出登录
              dispatch(logoutAction());
              // 路由跳转到/login
              navigate("/login", { replace: true });
            },
          },
        ],
      ],
    });
  };

  return (
    <div className={style.root}>
      <NavBar children="个人信息" onBack={() => navigate(-1)} />
      <List className="profile-list">
        <List.Item
          prefix="头像"
          extra={
            <Image
              fit="cover"
              width={"7vw"}
              height={"7vw"}
              style={{ borderRadius: "100%" }}
              src={data?.photo}
            />
          }
          arrow
          onClick={() => onListPopupShow("photo")}
        ></List.Item>
        <List.Item
          prefix="昵称"
          extra={data?.name}
          arrow
          onClick={() => {
            onInputPopupShow("name", data?.name || "");
          }}
        ></List.Item>
        <List.Item
          prefix="简介"
          extra={data?.intro}
          arrow
          onClick={() => onInputPopupShow("intro", data?.intro || "")}
        ></List.Item>
      </List>
      <List className="profile-list" style={{ marginTop: "5vw" }}>
        <List.Item
          prefix="性别"
          extra={data?.gender + "" === "0" ? "男" : "女"}
          arrow
          onClick={() => onListPopupShow("gender")}
        ></List.Item>
        <List.Item
          prefix="生日"
          extra={data?.birthday}
          arrow
          onClick={() => setShowBirthdayEdit(true)}
        ></List.Item>
      </List>

      {/* 通过input[type=file]来上传图片 */}
      <input
        ref={fileRef}
        type="file"
        style={{ display: "none" }}
        onChange={onUploadPhoto}
      />

      <div className="logout">
        <span onClick={onLogout}>退出登录</span>
      </div>

      {/* 修改生日的弹框 */}
      <DatePicker
        visible={showBirthdayEdit}
        value={new Date(data?.birthday || "")}
        min={new Date(1990, 0, 1, 0, 0, 0)}
        max={new Date()}
        onClose={() => setShowBirthdayEdit(false)}
        onConfirm={onUpdateBirthday}
        title="选择年月日"
      />

      {/* 修改昵称和简介的弹出层 */}
      <Popup visible={inputPopup.visible} position="right">
        <EditInput
          type={inputPopup.type}
          value={inputPopup.value}
          visible={inputPopup.visible}
          onClose={onInputPopupHide}
          onProfileUpdate={onUpdateProfile}
        />
      </Popup>

      {/* 修改性别和头像的弹出框 */}
      <Popup
        visible={listPopup.visible}
        onMaskClick={onListPopupHide}
        position="bottom"
      >
        <EditList
          type={listPopup.type}
          onClose={onListPopupHide}
          onHandleUpdate={onUpdateProfile}
        />
      </Popup>
    </div>
  );
};

export default ProfileEdit;
