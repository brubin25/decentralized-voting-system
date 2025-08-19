// src/pages/Index.jsx

import './index.css'
import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import { useVotingContract } from "../hooks/useVotingContract";
import dayjs from "dayjs";

import PieChart from '../components/PieChart';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    // render: text => <a>{text}</a>,
  },
  {
    title: 'Party',
    dataIndex: 'party',
  },
  {
    title: 'Total Vote',
    dataIndex: 'voteCount',
  },
];

// rowSelection object indicates the need for row selection
// const rowSelection = {
//   onChange: (selectedRowKeys, selectedRows) => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
//   getCheckboxProps: record => ({
//     name: record.name,
//   }),
// };




export default function IndexPage() {
  console.log('Index page')
  const [select, setSelect] = useState(null);
  const { contract, account } = useVotingContract();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [chart, setChart] = useState([])

  const loadElections = async () => {
    if (!contract) return;
    setLoading(true);
    try {

      const count = await contract.getElectionCount();
      console.log('count:', count)

      // const list = [];
      // for (let id = 0; id < count; id++) {
      // const e = await contract.getElection(id);
      const e = await contract.getElection(0);

      console.log('e:', e)
      const candidatesData = e[2]
      const candidates = [];
      candidatesData.forEach((c, i) => {
        console.log(`candidate #${c.id}:`, c.name, c.party, c.voteCount.toString());
        candidates.push({ name: c.name, party: c.party, voteCount: Number(c.voteCount), id: c.id.toString() })
      });
      // list.push({ id: e[0].toString(), title: e[1], starTs: dayjs(Number(e[3]) * 1000).format("YYYY-MM-DD HH:mm:ss"), endTs: dayjs(Number(e[4]) * 1000).format("YYYY-MM-DD HH:mm:ss"), candidates });
      // }
      // console.log('list:', list);
      // setElections(list);
      setData({ id: e[0].toString(), title: e[1], starTs: dayjs(Number(e[3]) * 1000).format("YYYY-MM-DD"), endTs: dayjs(Number(e[4]) * 1000).format("YYYY-MM-DD"), candidates })
      console.log('candidates', candidates)
      setChart(candidates);
    } catch (err) {
      console.error("fail to load:", err);
    }
    setLoading(false);
  };


  const handleRowChange = (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    setSelect(selectedRows[0])
  }

  const handleVote = async () => {
    try {
      console.log('toup:', data.id, select.id)
      const tx = await contract.vote(Number(data.id), Number(select.id));
      // Waiting for the transaction to be on the chain
      const receipt = await tx.wait();
      console.log("TransactionReceipt:", receipt);
      console.log("The vote was successful");
      loadElections();
    } catch (err) {
      console.error("Vote failed:", err.message);
      // alert("Vote failed：" + err.message);
    }
  };

  useEffect(() => {
    loadElections();
  }, [contract]);

  return (
    <>
      <div className="vote-title">Decentralized Voting Using Ethereum Blockchain</div>
      <div className='vote-stitle'>
        Welcome for Voting
      </div>
      {/* <div className='vote-time'>{!!elections[0] && <>Voting Dates: {elections[0].starTs} - {elections[0].endTs}</>}</div> */}
      <div className='vote-time'>{!!data && <>Voting Dates: {data.starTs} - {data.endTs}</>}</div>

      <div className='vote'>
        <div className='vote-table'>

          <Table
            rowSelection={{ type: 'radio', onChange: handleRowChange }}
            columns={columns}
            dataSource={data?.candidates}
            pagination={{ position: ['none'] }}
            bordered={true}
            loading={false}
            rowKey='id'
          />
          <div className='vote-tips'>
            Please select one of the candidates and click the vote button.
          </div>
          <div className='vote-footer'>
            <Button type='primary' size='large' block onClick={() => handleVote()} disabled={!select}>Vote</Button>
          </div>
        </div>
        <div className='vote-chart'>
          <PieChart data={chart}/>
        </div>

      </div>
    </>

  );
}
