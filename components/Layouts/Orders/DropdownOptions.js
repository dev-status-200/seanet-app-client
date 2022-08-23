import React, { useState } from 'react'
import { Modal, Menu } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { Row, Col, Spinner } from 'react-bootstrap'
import axios from 'axios';
import { RiExchangeFill } from 'react-icons/ri'

const DropdownOptions = ({value, theme, updateOrder}) => {

  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);

  const [detail, setDetail] = useState({
    Client:{name:''}
  });
  const [status, setStatus] = useState('');

  const updateStatus = async() => {
    setLoad(true);
    await axios.post(process.env.NEXT_PUBLIC_SEANET_SYS_STATUS_UPDATE_ORDER_POST,{
      id:detail.id,
      status:status
    }).then((x)=>{
      if(x.data[0]==1){
        setLoad(false);
        let tempValue = value;
        tempValue.status=status;
        updateOrder(tempValue);
        setVisible(false);
        setDetail({Client:{name:''}});
        setStatus('');
      }
    })
  }

  return (
    <div className=''>
      <Menu onClick={(e)=>{
        setVisible(true)
        console.log(value);
        setDetail(value)
        switch (e.key) {
          case '1':
            setStatus('GD Submitted');
            break;
          case '2':
            setStatus('Consignment Moved to Port');
            break;
            case '4':
              setStatus('On Vessel');
            break;
        }
      }}
        items={[
          {
            key: '1',
            label: (
            <span>
              GD Submitted
            </span>
            ),
            disabled:value.status==''?false:true
          },
          {
            key: '2',
            label: (
            <span>
              Consignment Move To Port
            </span>
            ),
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
            label: (<span>On Vessel</span>),
            disabled:value.status=='Loading Allowed'?false:true
          },
        ]}
      />
      <Modal 
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        centered
        footer={false}
        bodyStyle={{backgroundColor:theme=='light'?'white':'#162A46', borderRadius:1}}
        style={{color:theme=='light'?'black':'white'}}
      >
        <div>
        <Row className='m-2 text-center'>
        <div className=' my-2 theme-color'>
          <RiExchangeFill className='my-2' style={{fontSize:70}} /><br/>
          <span className='f-25'>Update Order status to <br/> {"("}<span style={{fontWeight:500}}>{status}</span>{")"} ?</span>
          </div>
          <div className='f-15'>
            Client: <span style={{fontWeight:500}}>{detail.Client.name}</span>
            <br/>Ref Invoice: <span style={{fontWeight:500}}> {detail.referenceInvoice} </span>
             Container no: <span style={{fontWeight:500}}> {detail.container}</span></div>
        </Row>
        <hr className='mx-3' />
          <Row className='text-center my-3' >
            <Col>
              <button 
                className={`mx-2 ${theme=='light'?'custom-btn-light':'custom-btn-dark'}`}
                onClick={()=>updateStatus()} disabled={load?true:false}
                >{!load?'Confirm':<Spinner animation="border" className='mx-3' size="sm" />}</button>
              <button className='cancel-btn mx-2' onClick={()=>setVisible(false)}>Cancel</button>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  )
}

export default DropdownOptions
