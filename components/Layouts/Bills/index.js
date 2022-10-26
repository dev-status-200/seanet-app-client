import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { AiFillDelete, AiFillEye, AiFillEdit, AiOutlineExclamationCircle, AiOutlineFileDone } from 'react-icons/ai';
import { FaClipboardList } from 'react-icons/fa';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

import { RiEBike2Line } from 'react-icons/ri';

import ShowInfo from './ShowInfo';
import CreateNewOrder from './CreateNewOrder';
import Edit from './Edit';
import { useSelector } from 'react-redux';
import aos from 'aos';
import 'aos/dist/aos.css';
import FileUpload from './FileUpload';

const Bills = ({orderData, clientData}) => {

    const theme = useSelector((state) => state.theme.value);

    const { confirm } = Modal;
    const [ orderList, setOrderList ] = useState([]);
    const [ viewVisible, setViewVisible ] = useState(false);
    const [ createVisible, setCreateVisible ] = useState(false);
    const [ editVisible, setEditVisible ] = useState(false);
    const [ fileVisible, setFileVisible ] = useState(false);

    const [view, setView] = useState({})
    const [editValues, setEditValues] = useState({})

    const [bulkOrders, setBulkOrders] = useState([])

      const getClientName = (ids) => {
        let values = ''
        for(let i = 0; i<clientData.result.length;i++){
            if(clientData.result[i].id==ids){
                values = clientData.result[i].name
            }
        }
        return values;
    }

    useEffect(()=>{
        setOrderList(orderData);
        aos.init({duration:500});
    }, []);

    const showConfirm = () => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const appendOrder = (x) => {
        let tempStateOne = [...orderList];
        tempStateOne.unshift(x);
        setOrderList(tempStateOne);
    }
    const updateOrder = (x) => {
        console.log(x)
        let tempState = [...orderList];
        let i = tempState.findIndex((y=>x.id==y.id));
        tempState[i] = x;
        setOrderList(tempState);
    }

    useEffect(() => {
      if(bulkOrders.length>0){
          let tempState = [...orderList];
          tempState.unshift(...bulkOrders);
          console.log(tempState)
          setOrderList(tempState);
          setBulkOrders([])
        }
    }, [bulkOrders])
    

  return (
    <div className={theme=='light'?'lightTheme':'darkTheme'}>
        <Row className='box m-3'>
        <Col><h3 className='f my-2'>Bills</h3></Col>
        <Col xs={'auto'}>
        <button  className='custom-btn' style={{float:'right'}} onClick={()=>setCreateVisible(true)}
            >Create New</button>
        <button className='custom-btn mx-3' style={{float:'right'}} onClick={()=>setFileVisible(true)}
            >Upload File</button>
        </Col>
        <div className='px-2'><hr className='my-2' /></div>
        <div className='table-sm-1 mt-3'>
        <Table className='tableFixHead'>
            <thead>
                <tr>
                <th>#</th>
                <th>Name</th>
                <th>Invoice{" "}No.</th>
                <th>Job{" "}No.</th>
                <th>Machine</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Barcode</th>
                <th>Modify</th>
                </tr>
            </thead>
            <tbody>
            {
            orderList.map((order, index)=>{
                return(
                <tr key={index} className='f'>
                    <td>{index+1}</td>
                    <td>{order.name}</td>
                    <td>{order.invoice}</td>
                    <td>{order.job}</td>
                    <td>{order.machineNo}</td>
                    <td>{order.balance}</td>
                    <td>
                        {order.status=='pending'&& 
                            <>
                                <span><AiOutlineExclamationCircle className='pending-icon' /></span>
                                <span className='mx-1 pending-text'>Pending</span>
                            </>
                        }
                        {order.status=='pipeline'&& 
                            <>
                                <span><RiEBike2Line className='pipeline-icon' /></span>
                                <span className='mx-1 pipeline-text'>On The Way!</span>
                            </>
                        }
                        {order.status=='complete'&& 
                            <>
                                <span><AiOutlineFileDone className='complete-icon' /></span>
                                <span className='mx-1 complete-text'>Completed!</span>
                            </>
                        }
                    </td>
                    <td>{order.code}</td>
                    <td>
                    <p style={{whiteSpace:'nowrap'}}>
                    <span>
                    <AiFillEye className='view-icon'
                        onClick={()=>{
                            setView(order); setViewVisible(true);
                    }} />
                    </span>
                        <span className='vertical-seperator'> | </span>
                    <span>
                    <AiFillEdit className='edit-icon' onClick={()=>{
                        if(order.status=='pending'){
                            setEditValues(order);
                            setEditVisible(true);
                        }else{
                            alert('Live Orders cannot be changed');
                        }
                    }} />
                    </span>
                        <span className='vertical-seperator'> | </span>
                    <span><AiFillDelete className='delete-icon' onClick={showConfirm}/></span>
                    </p>
                    </td>
                </tr>
                )
                })
            }
        </tbody>
        </Table>
        </div>
        </Row>
        {/* Modal For Viewing Records */}
        <Modal
            visible={viewVisible}
            onOk={() => setViewVisible(false)}
            onCancel={() => setViewVisible(false)}
            width={1000}
            footer={false}
            bodyStyle={{backgroundColor:theme=='light'?'white':'#162A46', borderRadius:1}}
            style={{color:theme=='light'?'black':'white'}}
        >
            <ShowInfo view={view}/>
            {/* Modal For Creating Records */}
        </Modal>
        {/* Modal For Creating Records */}
        <Modal
            visible={createVisible}
            onOk={() => setCreateVisible(false)}
            onCancel={() => setCreateVisible(false)}
            width={1000}
            footer={false}
            bodyStyle={{backgroundColor:theme=='light'?'white':'#162A46', borderRadius:1}}
            style={{color:theme=='light'?'black':'white'}}
        >
            <CreateNewOrder func={appendOrder} clientData={clientData} />
        </Modal>
        {/* Modal For Editing Records */}
        <Modal
            visible={editVisible}
            onOk={() => setEditVisible(false)}
            onCancel={() => setEditVisible(false)}
            width={1000}
            footer={false}
            bodyStyle={{backgroundColor:theme=='light'?'white':'#162A46', borderRadius:1}}
            style={{color:theme=='light'?'black':'white'}}
        >
            {editVisible && <Edit editValues={editValues} updateOrder={updateOrder} clientData={clientData} />}
        </Modal>
        {/* Modal For Uploading File */}
        <Modal
            visible={fileVisible}
            onOk={() => setFileVisible(false)}
            onCancel={() => setFileVisible(false)}
            width={1000}
            footer={false}
            bodyStyle={{backgroundColor:theme=='light'?'white':'#162A46', borderRadius:1}}
            style={{color:theme=='light'?'black':'white'}}
        >
            {fileVisible && <FileUpload clientData={clientData} setBulkOrders={setBulkOrders} />}
        </Modal>
    </div>
  )
}

export default Bills