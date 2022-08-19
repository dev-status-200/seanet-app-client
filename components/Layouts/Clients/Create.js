import React, { useEffect, useState } from 'react'
import {Row, Col, Form, Spinner } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import axios from 'axios'

const Create = ({appendClient, setVisible}) => {  

    const theme = useSelector((state) => state.theme.value);

    const [load, setLoad] = useState(false);

    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = (e) => {
        setLoad(true);
        e.preventDefault();
        axios.post(process.env.NEXT_PUBLIC_SEANET_SYS_CREATE_CLIENT_POST,{
            name:name,
            contact:contact,
            address:address
        }).then((x)=>{
            appendClient(x.data);
            setLoad(false);
            setVisible(false);
            setName('');setContact('');setAddress('')
        })
    }

  return (
    <div className={theme=='light'?'lightTheme':'darkTheme'}>
        <div className='f-30'>Create A New Client</div>
        <hr/>
      <Form className='' onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Name" required value={name} onChange={(e)=>setName(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Contact</Form.Label>
        <Form.Control type="text" placeholder="Contact" required value={contact} onChange={(e)=>setContact(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Address</Form.Label>
        <Form.Control as="textarea" rows={3} placeholder="Address" required  value={address} onChange={(e)=>setAddress(e.target.value)} />
      </Form.Group>
      <button className='custom-btn' disabled={load?true:false} type="submit">{!load?'Submit':<Spinner animation="border" className='mx-3' size="sm" />}</button>
    </Form>
    </div>
  )
}

export default Create
