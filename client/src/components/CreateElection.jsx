import { Button } from "antd";
import React, { useState } from "react";
// import Web3 from "web3";
export default function CreateElection({ contract, account,web3, refresh }) {
  const [title, setTitle] = useState("");
  const [cands, setCands] = useState([{ name: "", party: "" }, { name: "", party: "" }]);
  const [start, setStart] = useState(""); // datetime-local
  const [end, setEnd] = useState("");

  const addCandidate = () => setCands([...cands, { name: "", party: "" }]);
  const updateCand = (i, key, val) => {
    const next = [...cands];
    next[i][key] = val;
    setCands(next);
  };

  const toUnix = (s) => Math.floor(new Date(s).getTime() / 1000);

const handleCreate = async (e) => {
  e.preventDefault();

  // 1) 构造参数（不要再 filter(Boolean)，否则长度可能和 UI 行数不一致）
  const names = cands.map((c) => c.name.trim());
  const parties = cands.map((c) => c.party.trim());

  if (!title.trim()) { alert("标题不能为空"); return; }
  if (!start || !end) { alert("请选择开始和结束时间"); return; }
  if (names.some(n => !n) || parties.some(p => !p)) {
    alert("候选人姓名与政党均不能为空");
    return;
  }
  if (names.length < 2) { alert("至少需要 2 名候选人"); return; }

  const toUnix = (s) => Math.floor(new Date(s).getTime() / 1000);
  const startTs = toUnix(start);
  const endTs   = toUnix(end);
  if (endTs <= startTs) { alert("结束时间必须晚于开始时间"); return; }

  const method = contract.methods.createElection(title, names, parties, startTs, endTs);

  try {
    // 2) 先用 .call() 做一次本地模拟，确保不会触发 require
    await method.call({ from: account });

    // 3) 估算 gas（很多“Internal JSON-RPC error”就是这里让钱包猜错了）
    let gas;
    try {
      gas = await method.estimateGas({ from: account });
    } catch (eg) {
      console.warn("estimateGas failed, fall back to a safe gas limit", eg);
      // 兜底给一个相对保守的值
      gas = 500_000;
    }

    // 4) 明确指定 gas 和 gasPrice（强制走 Legacy，避免某些私链对 EIP-1559 不兼容）
    const gasPrice = await web3.eth.getGasPrice();

    // 5) 发送交易（此处才会弹钱包）
    await method.send({ from: account, gas: Math.floor(gas * 1.2), gasPrice });

    alert("投票已创建！");
    setTitle("");
    setCands([{ name: "", party: "" }, { name: "", party: "" }]);
    setStart("");
    setEnd("");
    refresh();
  } catch (err) {
    console.error("Transaction failed:", err);

    // 尽量把底层 revert reason 或 RPC message 展示出来，方便你调试
    const mmData = err?.data || err?.receipt || err;
    const reason = err?.message
      || mmData?.message
      || mmData?.originalError?.message
      || JSON.stringify(mmData);
    alert("创建失败：" + reason);
  }
};






  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, marginBottom: 24 }}>
      <h2>创建投票（管理员）</h2>
      
      <form onSubmit={handleCreate}>
        <div>
          <label>标题：</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>开始时间：</label>
          <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} required />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>结束时间：</label>
          <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} required />
        </div>

        <div style={{ marginTop: 12 }}>
          <h4>候选人</h4>
          {cands.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input placeholder="姓名" value={c.name} onChange={e => updateCand(i, "name", e.target.value)} required />
              <input placeholder="所属政党" value={c.party} onChange={e => updateCand(i, "party", e.target.value)} required />
            </div>
          ))}
          <button type="button" onClick={addCandidate}>+ 添加候选人</button>
        </div>

        <button type="submit" style={{ marginTop: 12 }}>发布投票到区块链</button>
      </form>
    </div>
  );
}
