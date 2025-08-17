import React, { useState } from 'react';
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // ← 引入 useNavigate
import './login.css'

const App = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate(); // ← 初始化路由跳转

  const onFinish = async (values) => {
    const { username, password, password2 } = values;

    if (password !== password2) {
      messageApi.open({
        type: 'error',
        content: 'Passwords do not match',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          voter_id: username,
          role: 'user',
          password
        })
      });

      if (res.ok) {
        const data = await res.json();
        messageApi.open({
          type: 'success',
          content: data.message || "Registration successful",
        });

        // 注册成功后跳转到 login 页面
        setTimeout(() => {
          navigate('/login'); // ← 替换为你 login 页面路由
        }, 1000);
      } else {
        const error = await res.json();
        message.error(error.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      message.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="login-title">Decentralized Voting Using Ethereum Blockchain</div>
      <div className="login">
        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360 }}
          onFinish={onFinish}
          size="large"
          disabled={loading}
          form={form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item
            name="password2"
            rules={[{ required: true, message: 'Please confirm your Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default App;
