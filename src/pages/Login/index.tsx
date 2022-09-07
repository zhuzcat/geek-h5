import { useCallback, useRef, useEffect, useState } from "react";
import { Button, NavBar, Form, Input, Toast } from "antd-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useLoginMutation,
  useGetCodeMutation,
} from "@/store/services/loginApi";
import { isErrorWithMessage } from "@/utils/http";
import styles from "./index.module.scss";
import { InputRef } from "antd-mobile/es/components/input";

type LoginForm = {
  mobile: string;
  code: string;
};

const Login = () => {
  // 存储重新获取验证码倒计时的state
  const [timeLeft, setTimeLeft] = useState(0);

  // 手机号输入框 ref
  const mobileRef = useRef<InputRef>(null);
  // 计时器唯一标识 ref
  const timerRef = useRef(-1);

  // navigate
  const navigate = useNavigate();

  // location信息
  const location = useLocation();

  // login的触发器
  const [login] = useLoginMutation();
  // getCode的触发器
  const [getCodeFn] = useGetCodeMutation();

  // 创建表单元素
  const [form] = Form.useForm<LoginForm>();

  // 在timeLeft等于0时，清除计时器
  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(timerRef.current);
    }
  }, [timeLeft]);

  // 在组件被销毁前，清除计时器
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  // 判断按钮是否 禁用
  const isDisabled: () => boolean = useCallback(() => {
    // 表单是否被用户操作过
    const isAllTouched = !form.isFieldsTouched(true);
    // 表单的错误个数是否为0
    const isFormHasError =
      form.getFieldsError().filter(({ errors }) => errors.length).length !== 0;

    return isFormHasError || isAllTouched;
  }, [form]);

  // 获取 验证码
  const getCode = async () => {
    // 获取手机号
    const mobile = (form.getFieldValue("mobile") || "") as string;
    // 判断表单验证情况
    const isHasError = form.getFieldError("mobile").length > 0;

    if (mobile.trim() === "" || isHasError) {
      return mobileRef.current?.focus();
    }

    // 获取验证码
    await getCodeFn(mobile);

    // 开启重新获取验证码的定时器
    setTimeLeft(60);
    // 注意：此处需要使用 window.setInterval
    // 因为 setInterval 默认返回 NodeJS.Timeout，使用 window.setInterval 后，返回值才是 number 类型的数值
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prevState) => prevState - 1);
    }, 1000);

    Toast.show({
      content: "验证码已发送",
      duration: 600,
    });
  };

  //  登录
  const onFinish = async (values: LoginForm) => {
    // 处理登录失败的错误
    try {
      await login(values).unwrap();

      Toast.show({
        content: "登录成功",
        duration: 600,
        afterClose: () => {
          // 登录成功 跳转路由
          if (location.state) {
            navigate((location.state as { from: string }).from, {
              replace: true,
            });
          } else {
            navigate("/home", { replace: true });
          }
        },
      });
    } catch (err) {
      if (isErrorWithMessage(err)) {
        Toast.show({
          content: err.message,
          duration: 1000,
        });
      }
    }
  };

  return (
    <div className={styles.root}>
      <NavBar onBack={() => navigate("/home", { replace: true })} />
      <div className="login-form">
        <h2 className="title">短信登录</h2>

        <Form
          form={form}
          validateTrigger={["onBlur"]}
          onFinish={onFinish}
          footer={
            // shouldUpdate属性用来指定每次form更新都会重新渲染该区域
            <Form.Item noStyle shouldUpdate>
              {() => {
                // 获取是否禁用的值
                const disabled = isDisabled();

                return (
                  <Button
                    block
                    color="primary"
                    className="login-submit"
                    disabled={disabled}
                    type="submit"
                  >
                    登 录
                  </Button>
                );
              }}
            </Form.Item>
          }
        >
          <Form.Item
            className="login-item"
            name="mobile"
            rules={[
              { required: true, message: "手机号不能为空" },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "请输入正确的手机号",
              },
            ]}
          >
            <Input
              ref={mobileRef}
              placeholder="请输入手机号"
              autoCapitalize="off"
              maxLength={11}
            />
          </Form.Item>
          <Form.Item
            className="login-item"
            name="code"
            rules={[
              { required: true, message: "验证码不能为空" },
              { len: 6, message: "验证码长度不能小于6位数" },
            ]}
            extra={
              <span
                className="code-extra"
                onClick={timeLeft === 0 ? getCode : undefined}
              >
                {timeLeft === 0 ? "发送验证码" : `${timeLeft}s 后重新获取`}
              </span>
            }
          >
            <Input
              placeholder="请输入验证码"
              autoComplete="off"
              maxLength={6}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
