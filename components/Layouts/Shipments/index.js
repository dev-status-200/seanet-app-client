import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';

import { Row, Col, Table } from 'react-bootstrap';
import { Modal, Dropdown, Menu, Space } from 'antd';

import { CloseCircleOutlined, EditOutlined, InfoCircleOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Create from './Create';
import DropdownOptions from './DropdownOptions';

import Edit from './Edit';
import Link from 'next/link';

import moment from 'moment'

import axios from 'axios';

const Shipments = ({clientData, orderData}) => {

  const [ visible, setVisible ] = useState(false);

  const [ edit, setEdit ] = useState(false);
  const [ editValues, setEditValues ] = useState({});

  const theme = useSelector((state) => state.theme.value);
  const [shipmentList, setShipmentList] = useState([]);

  useEffect(() => {
    setShipmentList(orderData)
  }, []);
  
  const appendClient = (x) => {
    let tempState = [...shipmentList];
    tempState.unshift(x);
    setShipmentList(tempState);
  }

  const updateShipment = async(x) => {
    console.log('edit',x)
    
    let tempState = [...shipmentList];
    let i = tempState.findIndex((y=>x.id==y.id));
    tempState[i] = x;
    setShipmentList(tempState);
    x.contacts.split(', ').forEach(async(y)=>{
      await axios.post('https://api.ultramsg.com/instance18662/messages/chat',{
      token:"1vgvz6c6zs7wjlfc",
      to:y,
      body:`The Shipment Status has been changed to ${x.status} Dated:${moment().format('MMMM Do YYYY, h:mm:ss a')}`,
      priority:"10",
      referenceId:""
    }).then((z)=>console.log(z.data))
})
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
              <tr key={index} className='f text-center row-hover'>
                <td>{index + 1}</td>
                <td>{x.Client.name}</td>
                <td>{x.consignment}</td>
                <td>{x.container}</td>
                <td>{x.terminal}</td>
                <td>{x.gd}</td>
                <td>
                  <Dropdown overlay={menu(x)}>
                    <Space style={{cursor:'pointer', fontWeight:500,
                      color:x.statusNo=="0"?'silver':x.statusNo=="17"?'rgb(185, 73, 73)':x.statusNo=="19"?'rgb(185, 73, 73)':
                      x.statusNo=="20"?'rgb(185, 73, 73)':x.statusNo=="21"?'rgb(185, 73, 73)':x.statusNo=="22"?'rgb(185, 73, 73)':
                      x.statusNo=="23"?'rgb(185, 73, 73)':x.statusNo=="24"?'rgb(185, 73, 73)':x.statusNo=="25"?'rgb(185, 73, 73)':
                      x.statusNo=="26"?'rgb(185, 73, 73)':x.statusNo=="31"?'rgb(185, 73, 73)':x.statusNo=="32"?'rgb(35, 127, 72)':
                      x.statusNo=="33"?'rgb(35, 127, 72)':'rgb(6, 150, 172)'}}>
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