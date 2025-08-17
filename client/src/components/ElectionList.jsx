import React from "react";

export default function ElectionList({ elections, onSelect }) {
  if (elections.length === 0) return <p>暂无投票</p>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
      {elections.map((e) => (
        <div key={e.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>{e.title}</h3>
          <div>开始：{new Date(e.startTime * 1000).toLocaleString()}</div>
          <div>结束：{new Date(e.endTime * 1000).toLocaleString()}</div>
          <div>候选人数：{e.candidateCount}</div>
          <button style={{ marginTop: 12 }} onClick={() => onSelect(e.id)}>查看 / 投票</button>
        </div>
      ))}
    </div>
  );
}
