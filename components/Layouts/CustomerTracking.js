import React, {useState, useEffect} from 'react'
import {Row, Col} from 'react-bootstrap'
import {IoAddCircleOutline} from 'react-icons/io5'
import {BsCheckCircle} from 'react-icons/bs'

import { Collapse } from 'antd';
const { Panel } = Collapse;

const CustomerTracking = ({clientData}) => {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        console.log(clientData)
        setOrders(clientData.result.Orders)
    }, []);
    const onChange = (key) => {
        console.log(key);
    };
    const statusCheck=(status,num)=>{
        let value = ''
        if(num==1 && status=='Consignment Moved to Port'){
            value='timeline-green'
        }else if((num==1||num==2) && status=='Gate Pass Issued'){
            value='timeline-green'
        }else if((num==1||num==2||num==3) && status=='Pass In'){
            value='timeline-green'
        }else if((num==1||num==2||num==3||num==4) && status=='Mark For Assessment'){
            value='timeline-green'
        }else if((num==1||num==2||num==3||num==4) && status=='Mark For Exam'){
            value='timeline-green'
        }else if((num==1||num==2||num==3||num==4) && status=='Mark For Anc'){
            value='timeline-green'
        }else if((num==1||num==2||num==3||num==4) && status=='Mark For Dec'){
            value='timeline-green'
        }else if((num==1||num==2||num==3||num==4||num==5) && status=='Loading Allowed'){
            value='timeline-green'
        }else if((num==1||num==2||num==3||num==4||num==5||num==6) && status=='On Vessel'){
            value='timeline-green'
        }else{
            value='timeline-grey'
        }
        return value
    }
    const assessCheck=(status,num)=>{
        let value = ''
        if(num==1 && (status=='Mark For Exam'||status=='Loading Allowed'||status=='On Vessel')){
            value='green'
        }else if((num==1||num==2) && (status=='Mark For Anc'||status=='Loading Allowed'||status=='On Vessel')){
            value='green'
        }else if((num==1||num==2||num==3) && (status=='Mark For Dec'||status=='Loading Allowed'||status=='On Vessel')){
            value='green'
        }else{
            value='grey'
        }
        return value
    }
  return (
    <><div className='orderTrackingStyles' style={{width:'98%'}}><Row>
        <Col md={12} className='mt-4 text-center'>
            <h2 className='top-h my-4'>SHIPMENT TRACKING</h2>
            <div className='line text-center'></div>
        </Col>
        <Col md={12} className='my-4'><div className='status-box'>
        <Collapse defaultActiveKey={['1']} onChange={onChange}>
        {
        orders.map((x, index)=>{
        return(
            <Panel header={`Vessel: ${x.vessel}  Container: ${x.container}`} key={index+1}>
            {x.status!=''&&
            <div className='p-4'>
                <Row>
                    <Col className={statusCheck(x.status,1)}></Col>
                    <Col className={statusCheck(x.status,2)}></Col>
                    <Col className={statusCheck(x.status,3)}></Col>
                    <Col className={statusCheck(x.status,4)}></Col>
                    <Col className={statusCheck(x.status,5)}></Col>
                    <Col className={statusCheck(x.status,6)}></Col>
                </Row>
                <Row>
                    <Col className='text-center'>
                        <IoAddCircleOutline className='status-icon'/>
                        <div className='status-text'>Consignment Moved To Port</div>
                    </Col>
                    <Col className='text-center'>
                        <IoAddCircleOutline className='status-icon'/>
                        <div className='status-text'>Gate Pass Issued</div>
                    </Col>
                    <Col className='text-center'>
                        <IoAddCircleOutline className='status-icon'/>
                        <div className='status-text'>Pass In</div>
                    </Col>
                    <Col className='text-center'>
                        <IoAddCircleOutline className='status-icon'/>
                        <div className='status-text'>Mark For Assessment</div>
                        <div className='status-text my-2'>EXAM <BsCheckCircle className={assessCheck(x.status,1)} /></div>
                        <div className='status-text my-2'>ANC <BsCheckCircle className={assessCheck(x.status,2)} /></div>
                        <div className='status-text my-2'>DEC <BsCheckCircle className={assessCheck(x.status,3)} /></div>
                    </Col>
                    <Col className='text-center'>
                        <IoAddCircleOutline className='status-icon'/>
                        <div className='status-text'>Loading Allowed</div>
                    </Col>
                    <Col className='text-center'>
                        <IoAddCircleOutline className='status-icon'/>
                        <div className='status-text'>On Vessel</div>
                    </Col>
                </Row>
            </div>
            }
            {x.status==''&&
                <h3 style={{color:'silver'}}>Order Pending For GD</h3>
            }
            </Panel>
            )
        })
        }
        </Collapse>
        </div>
        </Col>
    </Row>
    </div>
    </>
  )
}

export default CustomerTracking