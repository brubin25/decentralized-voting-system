import React, { useEffect, useState } from "react";

export default function ElectionDetail({ contract, electionId, account, onBack }) {
  const [info, setInfo] = useState(null);
  const [cands, setCands] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await contract.methods.getElection(electionId).call();
    const [title, startTime, endTime, admin, candidateCount] = res;
    const list = [];
    for (let i = 0; i < Number(candidateCount); i++) {
      const c = await contract.methods.getCandidate(electionId, i).call();
      list.push({ index: i, name: c[0], party: c[1], voteCount: Number(c[2]) });
    }
    setInfo({
      id: electionId,
      title,
      startTime: Number(startTime),
      endTime: Number(endTime),
      admin
    });
    setCands(list);
    setLoading(false);
  };

  const handleVote = async (idx) => {
    await contract.methods.vote(electionId, idx).send({ from: account });
    await load();
    alert("投票成功！");
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [electionId]);

  if (loading) return <p>加载中...</p>;
  const now = Math.floor(Date.now()/1000);
  const status = now < info.startTime ? "未开始" : now > info.endTime ? "已结束" : "进行中";

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
      <button onClick={onBack}>&larr; 返回</button>
      <h2>{info.title}</h2>
      <p>管理员：{info.admin}</p>
      <p>开始：{new Date(info.startTime*1000).toLocaleString()}</p>
      <p>结束：{new Date(info.endTime*1000).toLocaleString()}</p>
      <p>状态：{status}</p>
      <h3>候选人</h3>
      {cands.map(c => (
        <div key={c.index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #f0f0f0", borderRadius: 8, padding: 12, marginBottom: 8 }}>
          <div>
            <div><strong>{c.name}</strong>（{c.party}）</div>
            <div>已获票数：{c.voteCount}</div>
          </div>
          <button
            onClick={() => handleVote(c.index)}
            disabled={now < info.startTime || now > info.endTime}
            title={now < info.startTime ? "尚未开始" : now > info.endTime ? "已结束" : "投票"}>
            投票
          </button>
        </div>
      ))}
    </div>
  );
}
