// src/pages/Admin.jsx
import './admin.css'
import React from 'react';
import { MinusCircleOutlined, PlusOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, DatePicker, Row, Col } from 'antd';
const { RangePicker } = DatePicker;
const onFinish = values => {
  console.log('Received values of form:', values);


  //   {
  //     "title": "2342",
  //     "users": [
  //         {
  //             "first": "234",
  //             "last": "234"
  //         }
  //     ],
  //     "RangePicker": [
  //         "2025-08-05T04:00:00.000Z",
  //         "2025-09-18T04:00:00.000Z"
  //     ]
  // }
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const style = { background: '#0092ff', padding: '8px 0' };
const AdminPage = () => {
  console.log('Admin Page')
  const initValues = {
    // "title": "2342",
    "users": [
      {
        "first": "",
        "last": ""
      }
    ],
    // "RangePicker": [
    //     "2025-08-05T04:00:00.000Z",
    //     "2025-09-18T04:00:00.000Z"
    // ]
  }
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

        >
          <Form.Item name="title" label="Vote for what" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.List name="users">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField },index) => (

                  <div key={key}  className='vpitem'>
                    <div className='vpitemlabelwp'><label className="vpitemlabel" title="Vote for what">Candidate No.{index+1}</label></div>
                    <div className='vpiteminput'>
                      <Form.Item
                        {...restField}
                        name={[name, 'first']}
                        rules={[{ required: true, message: 'Missing first name' }]}
                      >
                        <Input placeholder="First Name" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'last']}
                        rules={[{ required: true, message: 'Missing last name' }]}
                      >
                        <Input placeholder="Last Name" />
                      </Form.Item>
                      {fields.length>1?<MinusCircleOutlined onClick={() => remove(name)} style={{fontSize: '24px'}} />:<div style={{width: '24px',height:'24px'}}></div>}
                      
                      {index == fields.length - 1 ? <PlusCircleOutlined onClick={() => add()} style={{fontSize:'24px'}} /> : <div style={{width: '24px',height:'24px'}}></div>}
                    </div>
                  </div>

                ))}
              </>
            )}
          </Form.List>

          <Form.Item
            label="Voting Dates"
            name="dates"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <RangePicker style={{width:'100%'}} />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Create A Vote
            </Button>
            <Button type="default" style={{width:'129px',marginLeft:'10px'}}>
              Reset
            </Button>
          </Form.Item>
        </Form>

      </div>

    </>

  )
};
export default AdminPage;