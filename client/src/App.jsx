// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import withAuth from "./hoc/withAuth";
import { UserOutlined,WalletOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import './App.css'


// 使用 HOC 包裹页面
const AuthIndex = withAuth(Index, ["user"]);
const AuthAdmin = withAuth(Admin, ["admin"]);

function App() {
  const { user, logout } = useAuth();
  console.log('App:',user)
  return (
    <Router>
      <>
        {
          user?.role && (
          <div className="login-status">
            <div className="login-status-info">
              <UserOutlined style={{fontSize:'24px',color:'#ffffff'}} />
              <div className="login-status-account">{user.voter_id}</div>
             
            </div>
            <div className="login-status-info">
              <WalletOutlined  style={{fontSize:'24px',color:'#ffffff'}}  />
              <div className="login-status-wallet">0x3F50aD108269A0bF1aF78E9b061F8D05F820b506</div>
            </div>
             <Button onClick={()=>logout()}>Login Out</Button>
          </div>
          )
        }
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/index" element={<AuthIndex />} />
          <Route path="/admin" element={<AuthAdmin />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </>
    </Router>
  );
}

export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
