import Web3 from "web3";

/**
 * 获取已注入的 provider（MetaMask）并返回 web3 实例、当前账户及链 ID。
 */
export async function getWeb3AndAccount() {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    const chainId = await web3.eth.getChainId();
    return { web3, accounts, chainId };
  } else {
    throw new Error("未检测到以太坊钱包（MetaMask）。");
  }
}
