import React, {useState, useEffect} from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import { Modal, Dropdown, Menu, Space } from 'antd';

import { useSelector } from 'react-redux';

import { CloseCircleOutlined, EditOutlined, InfoCircleOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';

import Create from './Create';


import { DownOutlined, SmileOutlined } from '@ant-design/icons';

const Orders = ({clientData, orderData}) => {

  const [ visible, setVisible ] = useState(false);
  const theme = useSelector((state) => state.theme.value);

  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    setOrderList(orderData)
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     console.log('Hello')
  //     axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_GET_ORDER_GET)
  //     .then((x)=>setOrderList(x.data))
  //   }, 1000 * 60 * 5)
  //   return () => clearInterval(intervalId)
  // }, [])
  
  const appendClient = (x) => {
    let tempState = [...orderList];
    tempState.unshift(x);
    setOrderList(tempState);
  }

const menu = (value) => (
  <Menu
    items={[
      {
        key: '1',
        label: (<span onClick={()=>console.log(value)}>GD Submitted</span>),
        disabled:value.status==''?false:true
      },
      {
        key: '2',
        label: (<span onClick={()=>console.log(value)}>Consignment Move To Port</span>),
        disabled:value.status=='GD Submitted'?false:true
      },
      {
        key: '3',
        label: ("Status reserved For Port Users (disabled)"),
        icon: <StopOutlined />,
        disabled: true,
      },
      {
        key: '4',
        //danger: true,
        label: 'On Vessel',
        disabled:value.status=='Loading Allowed'?false:true
      },
    ]}
  />
);

  return (
    <div>
      <div className={theme=='light'?'lightTheme':'darkTheme'}>
        <Row className='box m-3'>
          <Col><h3 className='f my-2'>Orders</h3></Col>
          <Col style={{textAlign:'right'}}>
            <button className='custom-btn' onClick={()=>setVisible(true)}>Create New</button>
          </Col>
          <div className='px-2'>
          <hr className='my-2' />
          </div>
          <div className='table-sm-1 mt-3'>
              <Table className='tableFixHead'>
              <thead>
                <tr className='text-center'>
                  <th>Sr.</th>
                  <th>Name</th>
                  <th>Consignment</th>
                  <th>Container No.</th>
                  <th>Terminal</th>
                  <th>GD no.</th>
                  <th>Status</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
              {
              orderList.map((x, index) => {
              return (
              <tr key={index} className='f text-center'>
                <td>{index + 1}</td>
                <td>{x.Client.name}</td>
                <td>{x.consignment}</td>
                <td>{x.container}</td>
                <td>{x.terminal}</td>
                <td>{x.gd}</td>
                <td>
                  <Dropdown overlay={menu(x)}>
                    <Space style={{cursor:'pointer',
                      color:x.status==""?'silver':(x.status=="GD Submitted"||x.status=="Consignment Moved to Port")?'black':
                      (x.status=="Gate Pass Issued"||x.status=="Pass In"||x.status=="Mark For Assessment"||x.status=="Mark For Examination"
                      ||x.status=="Mark For ANF"||x.status=="Mark For DEC")?'#0066cc':'green'
                    }}>
                      {x.status==""?'Pending GD':x.status}
                      {x.status=="On Vessel"?<CheckCircleOutlined className='my-2' />:""}
                    </Space>
                  </Dropdown>
                </td>
                <td>
                  <span>
                    <InfoCircleOutlined className='modify-info'/>
                  </span> <span className='mx-1'> | </span>
                  <span>
                    <EditOutlined className='modify-edit' />
                  </span> <span className='mx-1'> | </span>
                  <span>
                    <CloseCircleOutlined className='modify-red'/>
                  </span>
                </td>
              </tr>
                )
              })}
              </tbody>
              </Table>
          </div>
        </Row>
      </div>
      <Modal 
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={800}
        footer={false}
        bodyStyle={{backgroundColor:theme=='light'?'white':'#162A46', borderRadius:1}}
        style={{color:theme=='light'?'black':'white'}}
      >
        <Create clientData={clientData} appendClient={appendClient} setVisible={setVisible} />
      </Modal>
    </div>
  )
}

export default Orders;