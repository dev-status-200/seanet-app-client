import React, { useEffect, useState } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { EditOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import CreateOrEdit from './CreateOrEdit';

const Users = ({userData}) => {

    const [ edit, setEdit ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const theme = useSelector((state) => state.theme.value);
    const [userList, setUserList] = useState([])
    const [Profile, setProfile] = useState({
        f_name:'-', l_name:'', type:'-', address:'-', designation:'-', username:'-',
        email:'-', cnic:'-', contact:'-', password:'-', Permission:{}
    })

    useEffect(() => {
        console.log(userData)
        setUserList(userData)
    }, [])

    const appendClient = (x) => {
        console.log(x);
        let tempState = [...userList];
        tempState.unshift(x);
        setUserList(tempState);
    }
    const updateUser = (x) => {
        console.log(x)
        setProfile(x)
        let tempState = [...userList];
        let i = tempState.findIndex((y=>x.id==y.id));
        tempState[i] = x;
        setUserList(tempState);
    }

return (
<div className={theme=='light'?'lightTheme':'darkTheme'}>
    <Row>
    <Col md={7}>
    <div className='box m-1'>
    <Row>
        <Col><h3 className='f my-2'>Users</h3></Col>
        <Col style={{textAlign:'right'}}><button className='custom-btn' onClick={()=>setVisible(true)}>Create New</button></Col>
    </Row>
    <hr className='my-2' />
    <Row>
    {
    userList.map((x, index)=>{
        return(
        <Col className='user-profile-list py-3' key={index} onClick={()=>setProfile(x)}>
            <Row>
                <Col md={3}>
                    <img src={'/assets/user.png'} height={40} />
                </Col>
                <Col>
                    <div className='mx-2 fw-600' style={{lineHeight:1}}>{x.f_name} {x.l_name}</div>
                    <div className='mx-2 f-12 fw-300'>{x.type}</div>
                </Col>
            </Row>
        </Col>
        )
    })
    }
    </Row>
    </div>
    </Col>
    
    <Col md={5}>
        <div className='box m-1'>
            <EditOutlined style={{fontSize:20, float:'right', cursor:'pointer'}} onClick={()=>{setVisible(true); setEdit(true);}} />
            <div style={{textAlign:'center'}}>
                <img src={'/assets/user.png'} />
            </div>
            <div>
                <span>Full Name</span>
                <span className='fw-600' style={{float:'right'}}>{Profile.f_name} {Profile.l_name}</span>
            </div>
            <hr/>
            <div>
                <span>Type</span>
                <span className='fw-600' style={{float:'right'}}>{Profile.type}</span>
            </div><hr/>
            <div>
                <span>Designation</span>
                <span className='fw-600' style={{float:'right'}}>{Profile.designation}</span>
            </div><hr/>
            <div>
                <span>Contact</span>
                <span className='fw-600' style={{float:'right'}}>{Profile.contact}</span>
            </div><hr/>
            <div style={{height:40}}>
                <span>Address</span>
                <span className='fw-600' style={{float:'right', textAlign:'end', width:300}}>{Profile.address}</span>
            </div><hr/>
            <div>
                <span>CNIC</span>
                <span className='fw-600' style={{float:'right'}}>{Profile.cnic}</span>
            </div><hr/>
            <div>
                <span>Username</span>
                <span className='fw-600' style={{float:'right'}}>{Profile.username}</span>
            </div><hr/>
            <div>
                <span>Email</span>
                <span className='fw-600' style={{float:'right'}}>{Profile.email}</span>
            </div><hr/>
            <div>
                <span>PASSWORD</span>
                <span className='fw-600' style={{float:'right'}}>{Profile.password}</span>
            </div>
        </div>
    </Col>
    </Row>
    <Modal 
        visible={visible}
        onOk={() => {setVisible(false);setEdit(false);}}
        onCancel={() => {setVisible(false);setEdit(false);}}
        width={800}
        footer={false}
        bodyStyle={{backgroundColor:theme=='light'?'white':'#162A46', borderRadius:1}}
        style={{color:theme=='light'?'black':'white'}}
    >
        <CreateOrEdit setVisible={setVisible} appendClient={appendClient} edit={edit} setEdit={setEdit} Profile={Profile} updateUser={updateUser} />
    </Modal>
</div>
)}

export default Users
