// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import withAuth from "./hoc/withAuth";
import { UserOutlined, WalletOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import './App.css';
import { VotingProvider, useVotingContract } from "./hooks/useVotingContract";

const AuthIndex = withAuth(Index, ["user"]);
const AuthAdmin = withAuth(Admin, ["admin"]);

function AppContent() {
  const { user, logout } = useAuth();
  const { account, connectWallet } = useVotingContract();

  return (
    <Router>
      <>
        {user?.role && (
          <div className="login-status">
            <div className="login-status-info">
              <UserOutlined style={{ fontSize: '24px', color: '#fff' }} />
              <div className="login-status-account">{user.voter_id}</div>
            </div>
            <div className="login-status-info">
              <WalletOutlined style={{ fontSize: '24px', color: '#fff' }} />
              <div className="login-status-wallet">{account || "未连接"}</div>
              {!account && <Button onClick={connectWallet}>连接钱包</Button>}
            </div>
            <Button onClick={logout}>Logout</Button>
          </div>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
      <VotingProvider>
        <AppContent />
      </VotingProvider>
    </AuthProvider>
  );
}
