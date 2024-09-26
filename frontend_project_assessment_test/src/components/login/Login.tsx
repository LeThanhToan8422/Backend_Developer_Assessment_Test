import "../../sass/login.scss";
import axios from "axios";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";

import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    console.log("Received values of form: ", values);
    const response = await axios.get(
      `http://localhost:3000/users/logins/login?email=${values.email}&password=${values.password}`
    );
    if (response.data.data) {
      toast.success("Đăng nhập thành công!!!", {
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

      navigate("/jobs", {
        state: {
          user: response.data.data,
        },
      });
    } else {
      toast.error(response.data.error.message, {
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
    }
  };

  return (
    <div className="login">
      <span className="title">Đăng nhập</span>
      <Form
        name="login"
        initialValues={{ remember: true }}
        style={{
          width: 500,
          border: "1px solid black",
          padding: "40px",
          borderRadius: "10px",
        }}
        onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Username!" }]}>
          <Input
            prefix={<UserOutlined />}
            placeholder="email"
            style={{ height: "40px" }}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}>
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
            style={{ height: "40px" }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            style={{ width: "30%", marginRight: "10px" }}>
            Log in
          </Button>
          or <a onClick={() => navigate("/register")}>Register now!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
