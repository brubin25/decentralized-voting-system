// src/hooks/useVotingContract.js
import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import VotingABI from "../contracts/Voting.json";

const CONTRACT_ADDRESS = "0x6AF4995b44D53ce146C27C9187764c0bb2b8c184";

const VotingContext = createContext();

export function VotingProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please Install MetaMask！");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI.abi, signer);

      setProvider(provider);
      setSigner(signer);
      setAccount(account);
      setContract(contract);
      setChainId(network.chainId.toString());
    } catch (err) {
      console.error("Collecting Wallet Failed:", err);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setChainId(null);
  };

  // 页面刷新时检查是否已经授权过
  const checkAuthorized = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        // 已经授权过，直接恢复状态
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const account = accounts[0];
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI.abi, signer);

        setProvider(provider);
        setSigner(signer);
        setAccount(account);
        setContract(contract);
        setChainId(network.chainId.toString());
      }
    } catch (err) {
      console.error("检查授权状态失败:", err);
    }
  };

  // 监听钱包地址变化
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = accounts[0];
      const network = await provider.getNetwork();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI.abi, signer);

      setProvider(provider);
      setSigner(signer);
      setAccount(account);
      setContract(contract);
      setChainId(network.chainId.toString());
    } else {
      // 没有账号，清空状态
      setProvider(null);
      setSigner(null);
      setAccount(null);
      setContract(null);
      setChainId(null);
    }
  };

  // 监听网络变化
  const handleChainChanged = async (chainIdHex) => {
    console.log("网络切换:", chainIdHex);
    await checkAuthorized(); // 复用已有逻辑
  };


  useEffect(() => {

    if (!window.ethereum) return;

    // 页面初始连接
    checkAuthorized();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // 清理监听器
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };

  }, []);

  return (
    <VotingContext.Provider value={{ provider, signer, contract, account, chainId, connectWallet, disconnectWallet }}>
      {children}
    </VotingContext.Provider>
  );
}

export function useVotingContract() {
  return useContext(VotingContext);
}
