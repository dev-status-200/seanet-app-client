import React, {useState, useEffect} from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import Create from './Create';
import Router from 'next/router'

import { CloseCircleOutlined, EditOutlined, InfoCircleOutlined, StarOutlined } from '@ant-design/icons';

const Clients = ({clientData, sessionData}) => {

  useEffect(() => {
    if(sessionData.isLoggedIn==false) Router.push('/signin');
  }, [sessionData]);

  const [ visible, setVisible ] = useState(false);
  const theme = useSelector((state) => state.theme.value);

  const [clientList, setClientList] = useState([]);

  useEffect(() => {
    setClientList(clientData)
  }, []);

  const appendClient = (x) => {
    let tempState = [...clientList];
    tempState.unshift(x);
    setClientList(tempState);
  }

  return (
    <div>
      <div className={theme=='light'?'lightTheme':'darkTheme'}>
        <Row className='box m-3'>
          <Col><h3 className='f my-2'>Clients</h3></Col>
          <Col style={{textAlign:'right'}}>
            <button className='custom-btn' onClick={()=>setVisible(true)}>Create New</button>
          </Col>
          <div className='px-2'>
          <hr className='my-2' />
          </div>
          <div className='table-sm-1 mt-3'>
              <Table className='tableFixHead'>
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Rating</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
              {
              clientList.map((x, index) => {
              return (
              <tr key={index} className='f'>
                <td>{index + 1}</td>
                <td>{x.name}</td>
                <td>{x.contact}</td>
                <td style={{maxWidth:200}}>{x.address}</td>
                <td>
                  <StarOutlined />
                  <StarOutlined />
                  <StarOutlined />
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
        //width={1000}
        footer={false}
        bodyStyle={{backgroundColor:theme=='light'?'white':'#162A46', borderRadius:1}}
        style={{color:theme=='light'?'black':'white'}}
      >
        <Create appendClient={appendClient} setVisible={setVisible} />
      </Modal>
    </div>
  )
}

export default Clients