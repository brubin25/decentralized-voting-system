// src/pages/Login.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

import { LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Checkbox, Form, Input,} from 'antd';
import { useVotingContract } from "../hooks/useVotingContract";


import './login.css'
const App = () => {

  const { user, login } = useAuth();
  const { connectWallet} = useVotingContract();
  

  if (user?.isAuthenticated) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/index"} replace />;
  }
  const onFinish = values => {
    console.log('Received values of form: ', values);

    const voter_id=values.voterid;
    const password=values.password;
    const token=voter_id;

    const headers = {
      method: "GET",
      Authorization: `Bearer ${token}`
    };

    fetch(`http://127.0.0.1:8080/login?voter_id=${voter_id}&password=${password}`, { headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Login failed');
        }
      })
      .then(data => {
        const {role,token}=data;
        console.log('登录接口：',role,token)
        login({role,token,voter_id})
        connectWallet()

      })
      .catch(error => {
        console.error('Login failed:', error.message);
      });



    
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
            name="voterid"
            rules={[{ required: true, message: 'Please input your Voter ID!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Voter ID" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
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
              Log in
            </Button>
            or <a href="/register">Register now!</a>
          </Form.Item>
        </Form>
      </div>
    </>

  );
};
export default App;