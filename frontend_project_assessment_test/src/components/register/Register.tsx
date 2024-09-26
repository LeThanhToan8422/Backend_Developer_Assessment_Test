import { Button, Form, Input } from "antd";
import "../../sass/register.scss";
import axios from "axios";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Register = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const onFinish = async (values: {
    email: string;
    password: string;
    confirm: string;
  }) => {
    const response = await axios.post("http://localhost:3000/users/create", {
      email: values.email,
      password: values.password,
    });
    console.log(response.data);

    toast.success("Đăng ký thành công!!!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });

    navigate("/");
  };

  return (
    <div className="register">
      <span style={{ fontSize: "30px", fontWeight: "bold", margin: "20px 0" }}>
        Đăng ký
      </span>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ["zhejiang", "hangzhou", "xihu"],
          prefix: "86",
        }}
        style={{
          width: 600,
          border: "1px solid black",
          padding: "30px 30px 10px 0",
          borderRadius: "10px",
        }}
        scrollToFirstError>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
            {
              validator: async (_, value) => {
                const response = await axios.get(
                  `http://localhost:3000/users/email/${value}`
                );
                return response.data.data
                  ? Promise.reject(new Error("E-mail already exists!"))
                  : Promise.resolve();
              },
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              min: 4,
              message: "Password must be longer than or equal to 4 characters",
            },
            {
              pattern:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,}$/,
              message:
                "Password is required and must be at least 4 characters long, containing letters, numbers, and special characters.",
            },
          ]}
          hasFeedback>
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}>
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "10px" }}>
            Register
          </Button>
          or <a onClick={() => navigate("/")}>Login now!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
