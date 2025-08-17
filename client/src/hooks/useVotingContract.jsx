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

  const connectWallet = async () => {
    if (!window.ethereum) return alert("请安装 MetaMask！");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI.abi, signer);

      setProvider(provider);
      setSigner(signer);
      setAccount(account);
      setContract(contract);
    } catch (err) {
      console.error("连接钱包失败:", err);
    }
  };

  useEffect(() => {
    if (window.ethereum) connectWallet();
  }, []);

  return (
    <VotingContext.Provider value={{ provider, signer, contract, account, connectWallet }}>
      {children}
    </VotingContext.Provider>
  );
}

export function useVotingContract() {
  return useContext(VotingContext);
}
