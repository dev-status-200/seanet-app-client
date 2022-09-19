import React, { useEffect, useState } from 'react';
import {Row, Col, Form, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';

const CreateOrEdit = ({setVisible, appendClient, edit, setEdit, Profile, updateUser}) => {  

    const theme = useSelector((state) => state.theme.value);

    const [load, setLoad] = useState(false);

    const [id, setId] = useState('');
    const [f_name, setF_name] = useState('');
    const [l_name, setL_name] = useState('');
    const [type, setType] = useState('');
    const [address, setAddress] = useState('');
    const [designation, setDesignation] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [cnic, setCnic] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');

    const [shipment,   setShipment  ] = useState(false);
    const [analytics,  setAnalytics ] = useState(false);
    const [liveTrack,  setLiveTrack ] = useState(false);
    const [userManage, setUserManage] = useState(false);

    useEffect(() => {
      if(edit==true){
        console.log(Profile);
            setId(Profile.id)
            setF_name(Profile.f_name)
            setL_name(Profile.l_name)
            setType(Profile.type)
            setAddress(Profile.address)
            setDesignation(Profile.designation)
            setUsername(Profile.username)
            setEmail(Profile.email)
            setCnic(Profile.cnic)
            setContact(Profile.contact)
            setPassword(Profile.password)
            
            setShipment(Profile.Permission.f2=="1"?true:false)
            setAnalytics(Profile.Permission.f1=="1"?true:false)
            setLiveTrack(Profile.Permission.f3=="1"?true:false)
            setUserManage(Profile.Permission.f4=="1"?true:false)
      }
    }, [Profile, edit])

    useEffect(() => {
      if(edit==false){
        removeValues()
      }
    }, [edit])

    const handleSubmit = (e) => {
      console.log('Submit')
        setLoad(true);
        e.preventDefault();
        axios.post(process.env.NEXT_PUBLIC_SEANET_SYS_CREATE_USER_POST,{
            f_name:f_name,
            l_name:l_name,
            type:type,
            address:address,
            designation:designation,
            username:username,
            email:email,
            contact:contact,
            password:password,
            cnic:cnic,
            permissions:{
              shipment:shipment?1:0,
              analytics:analytics?1:0,
              liveTrack:liveTrack?1:0,
              userManage:userManage?1:0
            }
        }).then((x)=>{
            // let tempObj = x.data;
            // let clientName = clientData.find(obj => {
            //   return obj.id == x.data.ClientId
            // }).name
            // tempObj = {
            //     id: x.data.id, referenceInvoice: x.data.referenceInvoice,
            //     consignment: x.data.consignment, vessel: x.data.vessel,
            //     gd:x.data.gd, active:x.data.active,
            //     status: x.data.status, terminal: x.data.terminal,
            //     container: x.data.container, ClientId: x.data.ClientId,
            //     updatedAt: x.data.updatedAt, createdAt: x.data.createdAt,
            //     Client:{name:clientName}
            // }
            appendClient(x.data);
            removeValues();

            setLoad(false);
            setVisible(false);
        })
    }
    const handleEdit = (e) => {
      console.log('Edit')
        setLoad(true);
        e.preventDefault();
        axios.post(process.env.NEXT_PUBLIC_SEANET_SYS_EDIT_USER_POST,{
            id:id,
            f_name:f_name,
            l_name:l_name,
            type:type,
            address:address,
            designation:designation,
            username:username,
            email:email,
            contact:contact,
            password:password,
            cnic:cnic,
            permissions:{
              shipment:shipment?1:0,
              analytics:analytics?1:0,
              liveTrack:liveTrack?1:0,
              userManage:userManage?1:0
            }
        }).then((x)=>{
            // let tempObj = x.data;
            // let clientName = clientData.find(obj => {
            //   return obj.id == x.data.ClientId
            // }).name
            // tempObj = {
            //     id: x.data.id, referenceInvoice: x.data.referenceInvoice,
            //     consignment: x.data.consignment, vessel: x.data.vessel,
            //     gd:x.data.gd, active:x.data.active,
            //     status: x.data.status, terminal: x.data.terminal,
            //     container: x.data.container, ClientId: x.data.ClientId,
            //     updatedAt: x.data.updatedAt, createdAt: x.data.createdAt,
            //     Client:{name:clientName}
            // }
            console.log(x.data)
            if(x.data.resultOne[0]==1 && x.data.resultTwo[0]==1){
              //removeValues();
              updateUser({
                id:id,
                f_name:f_name,
                l_name:l_name,
                type:type,
                address:address,
                designation:designation,
                username:username,
                email:email,
                contact:contact,
                password:password,
                cnic:cnic,
                Permission:{
                  f2:shipment?"1":"0",
                  f1:analytics?"1":"0",
                  f3:liveTrack?"1":"0",
                  f4:userManage?"1":"0",
                  f5:  "0",
                  f6:  "0",
                  f7:  "0",
                  f8:  "0",
                  f9:  "0",
                  f10: "0",
                  f11: "0",
                  f12: "0",
                  f13: "0",
                  f14: "0",
                  f15: "0",
                  f16: "0",
                  f17: "0",
                  f18: "0",
                  f19: "0",
                  f20: "0",
                  UserId:id
                }
              })
              setEdit(false);
              setLoad(false);
              setVisible(false);
            }
        })
    }

    const removeValues = () => {
        setId("")
        setF_name("")
        setL_name("")
        setType("")
        setAddress("")
        setDesignation("")
        setUsername("")
        setEmail("")
        setCnic("")
        setContact("")
        setPassword("")

        setShipment(false)
        setAnalytics(false) 
        setLiveTrack(false) 
        setUserManage(false)
    }

  return (
    <div className={theme=='light'?'lightTheme':'darkTheme'}>
    <Form className='' onSubmit={edit?handleEdit:handleSubmit}>
    <Row>
    <Col md={8}>
    <div className='f-30'>User Details</div>
    <hr/>
    <Row>
    <Col md={6}>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Label>First Name</Form.Label>
      <Form.Control type="text" placeholder="First name" required value={f_name} onChange={(e)=>setF_name(e.target.value)} />
    </Form.Group>
    </Col>
    <Col md={6}>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Label>Last Name</Form.Label>
      <Form.Control type="text" placeholder="Last name" required value={l_name} onChange={(e)=>setL_name(e.target.value)} />
    </Form.Group>
    </Col>
    <Col md={6}>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Type</Form.Label>
        <Form.Select aria-label="Default select example" value={type} required onChange={(e)=>setType(e.target.value)}>
        <option>--- Select Type ---</option>
        <option value="Admin">Admin</option>
        <option value="Moderator">Moderator</option>
        <option value="Agent">Agent</option>
        <option value="Tracker">Tracker</option>
        </Form.Select>
      </Form.Group>
    </Col>
    <Col md={6}>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Label>Designation</Form.Label>
      <Form.Control type="text" placeholder="Designation" required value={designation} onChange={(e)=>setDesignation(e.target.value)} />
    </Form.Group>
    </Col>
    <Col md={6}>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Label>Contact</Form.Label>
      <Form.Control type="text" placeholder="Contact" required value={contact} onChange={(e)=>setContact(e.target.value)} />
    </Form.Group>
    </Col>
    <Col md={6}>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Label>Address</Form.Label>
      <Form.Control type="text" placeholder="Address" required value={address} onChange={(e)=>setAddress(e.target.value)} />
    </Form.Group>
    </Col>
    <Col md={6}>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Label>CNIC</Form.Label>
      <Form.Control type="text" placeholder="CNIC" required value={cnic} onChange={(e)=>setCnic(e.target.value)} />
    </Form.Group>
    </Col>
    <Col md={6}>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Label>Username</Form.Label>
      <Form.Control type="text" placeholder="username" required value={username} onChange={(e)=>setUsername(e.target.value)} />
    </Form.Group>
    </Col>
    <Col md={6}>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Label>E-mail</Form.Label>
      <Form.Control type="text" placeholder="E-mail" required value={email} onChange={(e)=>setEmail(e.target.value)} />
    </Form.Group>
    </Col>
    <Col md={6}>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Label>Password</Form.Label>
      <Form.Control type="text" placeholder="Password" required value={password} onChange={(e)=>setPassword(e.target.value)} />
    </Form.Group>
    </Col>
    </Row>
    </Col>
    <Col>
    <div className='f-30'>Access</div>
    <hr/>
      <div className='py-3'>
      <Row className='slider' onClick={()=>setShipment(!shipment)}>
        <Col className='py-1'><span>Shipment</span></Col>
        <Col className='py-1'>
        <Form.Check
          style={{float:'right'}}
          type="switch"
          id="custom-switch"
          checked={shipment?true:false}
          onChange={()=>{}}
          //label="Shipment Access"
          size='lg'
        />
        </Col>
      </Row>
      <Row className='slider' onClick={()=>setAnalytics(!analytics)}>
        <Col className='py-1'><span>Analytics </span></Col>
        <Col className='py-1'>
        <Form.Check
          style={{float:'right'}}
          type="switch"
          id="custom-switch"
          checked={analytics?true:false}
          onChange={()=>{}}
          //label="Analytics Access"
          size='lg'
        />
        </Col>
      </Row>
      <Row className='slider' onClick={()=>setLiveTrack(!liveTrack)}>
        <Col className='py-1'><span>Live Tracking</span></Col>
        <Col className='py-1'>
        <Form.Check
          style={{float:'right'}}
          type="switch"
          id="custom-switch"
          checked={liveTrack?true:false}
          onChange={()=>{}}
          //label="Live Tracking Access"
          size='lg'
        />
        </Col>
      </Row>
      <Row className='slider' onClick={()=>setUserManage(!userManage)}>
        <Col className='py-1' md={9}><span>User Management</span></Col>
        <Col className='py-1'>
        <Form.Check
          style={{float:'right'}}
          type="switch"
          id="custom-switch"
          checked={userManage?true:false}
          onChange={()=>{}}
          //label="Live Tracking Access"
          size='lg'
        />
        </Col>
      </Row>
      </div>
    </Col>
    </Row>
      <button className='custom-btn' disabled={load?true:false} type="submit">{!load?(edit?'Update':'Submit'):<Spinner animation="border" className='mx-3' size="sm" />}</button>
    </Form>
    </div>
  )
}

export default CreateOrEdit