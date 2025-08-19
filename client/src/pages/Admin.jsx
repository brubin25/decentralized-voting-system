// src/pages/Admin.jsx
import './admin.css'
import React, { useState } from 'react';
import { MinusCircleOutlined, PlusOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, DatePicker, Row, Col } from 'antd';
const { RangePicker } = DatePicker;

import { useVotingContract } from "../hooks/useVotingContract";




const AdminPage = () => {
  console.log('Admin Page')

  const { contract, account } = useVotingContract();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const initValues = {
    candidates: [
      {
        name: "",
        party: ""
      },
      {
        name: "",
        party: ""
      }
    ],
  }



  const handleCreateElection = async ({ title, candidates, startTs, endTs }) => {
    if (!contract) return alert("Contract is not connected");
    setLoading(true);
    try {
      const tx = await contract.createElection(
        title,
        candidates,
        startTs,
        endTs
      );
      
      const receipt = await tx.wait();
      console.log("TransactionReceipt:", receipt);
      form.resetFields();
    } catch (err) {
      console.error("Creat error:", err.message);
    }
    setLoading(false);
  };


  const onFinish = values => {
    console.log('Received values of form:', values);
    const { title, candidates, dates } = values;
    const startTs = dates[0].valueOf();
    const endTs = dates[1].valueOf()
    handleCreateElection({ title, candidates, startTs:startTs/1000, endTs:endTs/1000 })
  };


  return (
    <>
      <div className="admin-title">Decentralized Voting Using Ethereum Blockchain</div>
      <div className="admin">
        <Form
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          autoComplete="off"
          initialValues={initValues}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          size='large'
          disabled={loading}
          form={form}

        >
          <Form.Item name="title" label="Activity Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.List name="candidates">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (

                  <div key={key} className='vpitem'>
                    <div className='vpitemlabelwp'><label className="vpitemlabel">Candidate No.{index + 1}</label></div>
                    <div className='vpiteminput'>
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Missing The Name' }]}
                      >
                        <Input placeholder="Candidate's Name" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'party']}
                        rules={[{ required: true, message: 'Missing The Party' }]}
                      >
                        <Input placeholder="Party" />
                      </Form.Item>
                      {fields.length > 1 ? <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: '24px' }} /> : <div style={{ width: '24px', height: '24px' }}></div>}

                      {index == fields.length - 1 ? <PlusCircleOutlined onClick={() => add()} style={{ fontSize: '24px' }} /> : <div style={{ width: '24px', height: '24px' }}></div>}
                    </div>
                  </div>

                ))}
              </>
            )}
          </Form.List>

          <Form.Item
            label="Voting Dates"
            name="dates"
            rules={[{ required: true, message: 'Please Input Voting Dates!' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create A Vote
            </Button>
            <Button type="default" style={{ width: '129px', marginLeft: '10px' }} htmlType="reset">
              Reset
            </Button>
          </Form.Item>
        </Form>

      </div>

    </>

  )
};
export default AdminPage;
