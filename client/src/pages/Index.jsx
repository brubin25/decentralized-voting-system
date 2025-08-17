// src/pages/Index.jsx

import './index.css'
import React, { useState } from 'react';
import { Button, Divider, Radio, Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Party',
    dataIndex: 'party',
  },
  {
    title: 'Total Vote',
    dataIndex: 'votes',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    votes: 32,
    party: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    votes: 42,
    party: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    votes: 32,
    party: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Disabled User',
    votes: 99,
    party: 'Sydney No. 1 Lake Park',
  },
];
// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    name: record.name,
  }),
};


export default function IndexPage() {
  console.log('Index page')
  const [select, setSelect] = useState(null);

  const handleRowChange = (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    setSelect(selectedRows[0])
  }

  const handleVote = () => {
    console.log('vote:', select)
  }



  return (
    <>
      <div className="vote-title">Decentralized Voting Using Ethereum Blockchain</div>
      <div className='vote-stitle'>
        Welcome for Voting
      </div>
      <div className='vote-time'>Voting Dates: Wed Dec 31 1969 - Wed Dec 31 1969</div>
      <div className='vote'>
        <Table
          rowSelection={{ type: 'radio', onChange: handleRowChange }}
          columns={columns}
          dataSource={data}
          pagination={{ position: ['none'] }}
          bordered={true}
          loading={false}
        />
        <div className='vote-tips'>
          Please select one of the candidates and click the vote button.
        </div>
        <div className='vote-footer'>
          <Button type='primary' size='large' block onClick={() => handleVote()} disabled={!select}>Vote</Button>
        </div>

      </div>
    </>

  );
}
