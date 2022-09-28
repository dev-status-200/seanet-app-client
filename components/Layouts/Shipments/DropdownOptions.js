import React, { useState, useEffect } from 'react'
import { Modal, Menu } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { Row, Col, Spinner, Form } from 'react-bootstrap'
import axios from 'axios';
import { RiExchangeFill } from 'react-icons/ri'
import statuses from '../../../Statuses/status.json'

const DropdownOptions = ({value, theme, updateShipment}) => {

  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);
 
  const [detail, setDetail] = useState({
    Client:{name:''}
  });
  const [status, setStatus] = useState('');
  const [statusNo, setStatusNo] = useState('');
  const [currstatNo, setCurrStatNo] = useState(''); // For current status No

  const updateStatus = async() => {
    setLoad(true);
    console.log(value.contacts)
    await axios.post(process.env.NEXT_PUBLIC_SEANET_SYS_STATUS_UPDATE_ORDER_POST,{
      id:detail.id,
      status:status,
      statusNo:statusNo
    }).then((x)=>{
      if(x.data[0]==1){
        setLoad(false);
        setCurrStatNo(statusNo)
        let tempValue = value;
        tempValue.status=status;
        tempValue.statusNo=statusNo;
        updateShipment(tempValue);
        setVisible(false);
        setDetail({Client:{name:''}});
        setStatus('');
      }
    })
  }

  useEffect(() => {
    console.log(value)
    setCurrStatNo(value.statusNo)
  }, [value])

  return (
    <div className=''>
      <Menu style={{maxHeight:300, overflowY:'auto', overflowX:'hidden', border:'1px solid silver'}} onClick={(e)=>{
        setVisible(true)
        setDetail(value)
      }}
        items={[
          {
            key: '1', onClick: (()=>{ setStatus(statuses[1]); setStatusNo('1'); }),
            label: (<div className={currstatNo=='1'?'selected-status':'stat'}>{statuses[1]}</div>),
          },
          {
            key: '2', onClick: (()=>{ setStatus(statuses[2]); setStatusNo('2'); }),
            label: (<div className={currstatNo=='2'?'selected-status':'stat'}>{statuses[2]}</div>),
            //disabled:value.status=='GD Submitted'?false:true
          },
          {
            key: '3', onClick: (()=>{ setStatus(statuses[3]); setStatusNo('3'); }),
            label: (<div className={currstatNo=='3'?'selected-status':'grey-stat'}>
              <StopOutlined style={{position:'relative', bottom:'4px'}} /> {statuses[3]}</div>),
            disabled:true
          },
          {
            key: '4', onClick: (()=>{ setStatus(statuses[4]); setStatusNo('4'); }),
            label: (<div className={currstatNo=='4'?'selected-status':'grey-stat'}>
              <StopOutlined style={{position:'relative', bottom:'4px'}} /> {statuses[4]}</div>),
            disabled:true
          },
          {
            key: '5', onClick: (()=>{ setStatus(statuses[5]); setStatusNo('5'); }),
            label: (<div className={currstatNo=='5'?'selected-status':'grey-stat'}><StopOutlined style={{position:'relative', bottom:'4px'}} /> {statuses[5]}</div>),
            disabled:true
          },
          {
            key: '6', onClick: (()=>{ setStatus(statuses[6]); setStatusNo('6'); }),
            label: (<div className={currstatNo=='6'?'selected-status':'stat'}>{statuses[6]}</div>)
          },
          {
            key: '7', onClick: (()=>{ setStatus(statuses[7]); setStatusNo('7'); }),
            label: (<div className={currstatNo=='7'?'selected-status':'stat'}>{statuses[7]}</div>)
          },
          {
            key: '8', onClick: (()=>{ setStatus(statuses[8]); setStatusNo('8'); }),
            label: (<div className={currstatNo=='8'?'selected-status':'stat'}>{statuses[8]}</div>)
            //disabled: true,
          },
          {
            key: '9', onClick: (()=>{ setStatus(statuses[9]); setStatusNo('9'); }),
            label: (<div className={currstatNo=='9'?'selected-status':'stat'}>{statuses[9]}</div>)
          },
          {
            key: '10', onClick: (()=>{ setStatus(statuses[10]); setStatusNo('10'); }),
            label: (<div className={currstatNo=='10'?'selected-status':'stat'}>{statuses[10]}</div>)
          },
          {
            key: '11', onClick: (()=>{ setStatus(statuses[11]); setStatusNo('11'); }),
            label: (<div className={currstatNo=='11'?'selected-status':'stat'}>{statuses[11]}</div>)
          },
          {
            key: '12', onClick: (()=>{ setStatus(statuses[12]); setStatusNo('12'); }),
            label: (<div className={currstatNo=='12'?'selected-status':'grey-stat'}>
              <StopOutlined style={{position:'relative', bottom:'4px'}} /> {statuses[12]}</div>),
            disabled:true
          },
          {
            key: '13', onClick: (()=>{ setStatus(statuses[13]); setStatusNo('13'); }),
            label: (<div className={currstatNo=='13'?'selected-status':'stat'}>{statuses[13]}</div>)
          },
          {
            key: '14', onClick: (()=>{ setStatus(statuses[14]); setStatusNo('14'); }),
            label: (<div className={currstatNo=='14'?'selected-status':'grey-stat'}>
              <StopOutlined style={{position:'relative', bottom:'4px'}} /> {statuses[14]}</div>),
            disabled:true
          },
          {
            key: '15', onClick: (()=>{ setStatus(statuses[15]); setStatusNo('15'); }),
            label: (<div className={currstatNo=='15'?'selected-status':'stat'}>{statuses[15]}</div>)
          },
          {
            key: '16', onClick: (()=>{ setStatus(statuses[16]); setStatusNo('16'); }),
            label: (<div className={currstatNo=='16'?'selected-status':'stat'}>{statuses[16]}</div>)
          },
          {
            key: '17', onClick: (()=>{ setStatus(statuses[17]); setStatusNo('17'); }),
            label: (<div className={`red-stat ${currstatNo=='17'?'selected-error-status':'stat'}`}>{statuses[17]}</div>)
          },
          {
            key: '18', onClick: (()=>{ setStatus(statuses[18]); setStatusNo('18'); }),
            label: (<div className={currstatNo=='18'?'selected-status':'grey-stat'}>
              <StopOutlined style={{position:'relative', bottom:'4px'}} /> {statuses[18]}</div>),
            disabled:true
          },
          {
            key: '19', onClick: (()=>{ setStatus(statuses[19]); setStatusNo('19'); }),
            label: (<div className={`red-stat ${currstatNo=='19'?'selected-error-status':'stat'}`}>{statuses[19]}</div>)
          },
          {
            key: '20', onClick: (()=>{ setStatus(statuses[20]); setStatusNo('20'); }),
            label: (<div className={`red-stat ${currstatNo=='20'?'selected-error-status':'stat'}`}>{statuses[20]}</div>)
          },
          {
            key: '21', onClick: (()=>{ setStatus(statuses[21]); setStatusNo('21'); }),
            label: (<div className={`red-stat ${currstatNo=='21'?'selected-error-status':'stat'}`}>{statuses[21]}</div>)
          },
          {
            key: '22', onClick: (()=>{ setStatus(statuses[22]); setStatusNo('22'); }),
            label: (<div className={`red-stat ${currstatNo=='22'?'selected-error-status':'stat'}`}>{statuses[22]}</div>)
          },
          {
            key: '23', onClick: (()=>{ setStatus(statuses[23]); setStatusNo('23'); }),
            label: (<div className={`red-stat ${currstatNo=='23'?'selected-error-status':'stat'}`}>{statuses[23]}</div>)
          },
          {
            key: '24', onClick: (()=>{ setStatus(statuses[24]); setStatusNo('24'); }),
            label: (<div className={`red-stat ${currstatNo=='24'?'selected-error-status':'stat'}`}>{statuses[24]}</div>)
          },
          {
            key: '25', onClick: (()=>{ setStatus(statuses[25]); setStatusNo('25'); }),
            label: (<div className={`red-stat ${currstatNo=='25'?'selected-error-status':'stat'}`}>{statuses[25]}</div>)
          },
          {
            key: '26', onClick: (()=>{ setStatus(statuses[26]); setStatusNo('26'); }),
            label: (<div className={`red-stat ${currstatNo=='26'?'selected-error-status':'stat'}`}>{statuses[26]}</div>)
          },
          {
            key: '27', onClick: (()=>{ setStatus(statuses[27]); setStatusNo('27'); }),
            label: (<div className={currstatNo=='27'?'selected-status':'stat'}>{statuses[27]}</div>)
          },
          {
            key: '28', onClick: (()=>{ setStatus(statuses[28]); setStatusNo('28'); }),
            label: (<div className={currstatNo=='28'?'selected-status':'stat'}>{statuses[28]}</div>)
          },
          {
            key: '29', onClick: (()=>{ setStatus(statuses[29]); setStatusNo('29'); }),
            label: (<div className={currstatNo=='29'?'selected-status':'stat'}>{statuses[29]}</div>)
          },
          {
            key: '30', onClick: (()=>{ setStatus(statuses[30]); setStatusNo('30'); }),
            label: (<div className={currstatNo=='30'?'selected-status':'grey-stat'}>
              <StopOutlined style={{position:'relative', bottom:'4px'}} /> {statuses[30]}</div>),
            disabled:true
          },
          {
            key: '31', onClick: (()=>{ setStatus(statuses[31]); setStatusNo('31'); }),
            label: (<div className={`red-stat ${currstatNo=='31'?'selected-error-status':'stat'}`}>{statuses[31]}</div>)
          },
          {
            key: '32', onClick: (()=>{ setStatus(statuses[32]); setStatusNo('32'); }),
            label: (<div className={currstatNo=='32'?'selected-green-status':'green-stat'}>{statuses[32]}</div>)
          },
          {
            key: '33', onClick: (()=>{ setStatus(statuses[33]); setStatusNo('33'); }),
            label: (<div className={currstatNo=='33'?'selected-green-status':'green-stat'}>{statuses[33]}</div>)
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
          {statusNo=='31'&&
            <div className='f-20 my-2'>
              <div>Enter Reason</div>
              <Form.Control value={status} style={{textAlign:'center'}} onChange={(e)=>setStatus(e.target.value)} />
            </div>
            }
          <div className='f-20'>
            Client: <span style={{fontWeight:500}}>{detail.Client.name}</span>
            <br/>Ref Invoice: <span style={{fontWeight:500}}> {detail.referenceInvoice} </span>
             Container no: <span style={{fontWeight:500}}> {detail.container}</span>
          </div>
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