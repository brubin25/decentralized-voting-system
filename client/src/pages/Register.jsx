// src/pages/Login.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

// export default function Login() {
//   const { user, login } = useAuth();

//   if (user?.isAuthenticated) {
//     return <Navigate to={user.role === "admin" ? "/admin" : "/index"} replace />;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold">Login Page</h1>
//       <button
//         className="px-4 py-2 m-2 bg-blue-500 text-white rounded"
//         onClick={() => login("user")}
//       >
//         Login as User
//       </button>
//       <button
//         className="px-4 py-2 m-2 bg-green-500 text-white rounded"
//         onClick={() => login("admin")}
//       >
//         Login as Admin
//       </button>
//     </div>
//   );
// }



import React from 'react';
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';

import './login.css'
const App = () => {

//   const { user, login } = useAuth();

//   if (user?.isAuthenticated) {
//     return <Navigate to={user.role === "admin" ? "/admin" : "/index"} replace />;
//   }
  const onFinish = values => {
    console.log('Received values of form: ', values);
    login('user')
  };
  return (
    <>
      <div className="login-title">Decentralized Voting Using Ethereum Blockchain</div>
      <div className="login">
        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360 }}
          onFinish={onFinish}
          size="large"
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
            <Input.Password prefix={<LockOutlined />}  placeholder="Password"   iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
          </Form.Item>
                    <Form.Item
            name="password2"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />}  placeholder="Password"   iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
          </Form.Item>
          {/* <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="">Forgot password</a>
            </Flex>
          </Form.Item> */}

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Register
            </Button>
            {/* or <a href="/register">Register now!</a> */}
          </Form.Item>
        </Form>
      </div>
    </>

  );
};
export default App;