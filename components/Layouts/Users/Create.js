import React, { useEffect, useState } from 'react';
import {Row, Col, Form, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Create = ({setVisible, appendClient}) => {  

    const theme = useSelector((state) => state.theme.value);

    const [load, setLoad] = useState(false);

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

    const handleSubmit = (e) => {
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
            cnic:cnic
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

            setLoad(false);
            setVisible(false);
        })
    }

  return (
    <div className={theme=='light'?'lightTheme':'darkTheme'}>
    <Form className='' onSubmit={handleSubmit}>
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
    </Col>
    </Row>
    <button className='custom-btn' disabled={load?true:false} type="submit">{!load?'Submit':<Spinner animation="border" className='mx-3' size="sm" />}</button>
    </Form>
    </div>
  )
}

export default Create