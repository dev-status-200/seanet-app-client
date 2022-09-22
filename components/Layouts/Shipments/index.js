import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';

import { Row, Col, Table } from 'react-bootstrap';
import { Modal, Dropdown, Menu, Space } from 'antd';

import { CloseCircleOutlined, EditOutlined, InfoCircleOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Create from './Create';
import DropdownOptions from './DropdownOptions';

import Edit from './Edit';
import Link from 'next/link';

const Shipments = ({clientData, orderData}) => {

  const [ visible, setVisible ] = useState(false);

  const [ edit, setEdit ] = useState(false);
  const [ editValues, setEditValues ] = useState({});

  const theme = useSelector((state) => state.theme.value);
  const [orderList, setOrderList] = useState([]);
  const [shipmentList, setShipmentList] = useState([]);

  useEffect(() => {
    //setOrderList(orderData)
    setShipmentList(orderData)
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     console.log('Hello')
  //     axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_GET_ORDER_GET)
  //     .then((x)=>setOrderList(x.data))
  //   }, 1000 * 10)
  //   return () => clearInterval(intervalId)
  // }, [])
  
  const appendClient = (x) => {
    let tempState = [...shipmentList];
    tempState.unshift(x);
    setShipmentList(tempState);
  }

  const updateOrder = (x) => {
    console.log(x)
    let tempState = [...shipmentList];
    let i = tempState.findIndex((y=>x.id==y.id));
    tempState[i] = x;
    setShipmentList(tempState);
  }

  const updateShipment = (x) => {
    console.log(x)
    let tempState = [...shipmentList];
    let i = tempState.findIndex((y=>x.id==y.id));
    tempState[i] = x;
    setShipmentList(tempState);
  }

  const menu = (value) => ( <DropdownOptions value={value} theme={theme} updateShipment={updateShipment} /> );
  const link = (value) => ( 
    <Menu 
      items={[
        { key:'1',
          label: (
          <Link href={`/tracking?id=${value.ClientId}`} rel="noopener noreferrer">
            <a target="_blank">Customer Link</a>
          </Link>
          ),disabled:value.status==''?true:false
        },
      ]}
    />
  );

  return (
    <div>
      <div className={theme=='light'?'lightTheme':'darkTheme'}>
        <Row className='box m-3'>
          <Col><h3 className='f my-2'>Shipments</h3></Col>
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
              shipmentList.map((x, index) => {
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
                      color:x.status==""?'silver':(x.status=="GD Submitted"&&theme=='dark')?'white':
                      (x.status=="GD Submitted"&&theme=='light')?'black':
                      (x.status=="Consignment Moved to Port"||x.status=="Gate Pass Issued"||x.status=="Pass In"||x.status=="Mark For Assessment"||x.status=="Mark For Examination"
                      ||x.status=="Mark For ANF"||x.status=="Mark For DEC")?'#0066cc':'green'
                    }}>
                      {x.status==""?'Pending GD':x.status}
                      {x.status=="On Vessel"?<CheckCircleOutlined className='my-2' />:""}
                    </Space>
                  </Dropdown>
                </td>
                <td>
                  <span>
                  <Dropdown  overlay={link(x)} placement="bottom" arrow={{ pointAtCenter: true }}>
                    <Space style={{cursor:'pointer'}}>
                      <InfoCircleOutlined className='modify-info'/>
                    </Space>
                  </Dropdown>
                  </span> <span className='mx-1'> | </span>
                  <span>
                    <EditOutlined className='modify-edit' onClick={()=>{
                      setEditValues(x);
                      setEdit(true);
                      setVisible(true);
                    }} />
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
        onOk={() => {setVisible(false); setEdit(false); setEditValues({});}}
        onCancel={() => {setVisible(false); setEdit(false); setEditValues({});}}
        width={edit?600:800}
        footer={false}
        bodyStyle={{backgroundColor:theme=='light'?'white':'#162A46', borderRadius:1}}
        style={{color:theme=='light'?'black':'white'}}
      >
        {!edit&&<Create clientData={clientData} appendClient={appendClient} setVisible={setVisible} />}
        {edit&&<Edit editValues={editValues} setVisible={setVisible} updateShipment={updateShipment} />}
      </Modal>
    </div>
  )
}

export default Shipments;