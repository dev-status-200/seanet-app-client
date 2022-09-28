import React, { useEffect, useState } from 'react';
import {Row, Col, Form, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { PatternFormat  } from 'react-number-format';

const Edit = ({setVisible, editValues, updateShipment}) => {  

    const theme = useSelector((state) => state.theme.value);

    const [load, setLoad] = useState(false);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [consignment, setConsignment] = useState('');
    const [referenceInv, setReferenceInv] = useState('');
    const [vessel, setVessel] = useState('');
    const [gd, setGd] = useState('');
    const [container, setContainer] = useState('');
    const [terminal, setTerminal] = useState('');
    const [contacts, setContacts] = useState([
      {num:''},
      {num:''},
      {num:''},
  ])

    useEffect(() => {
        console.log(editValues)
        setId(editValues.id)
        setName(editValues.Client.name)
        setConsignment(editValues.consignment)
        setReferenceInv(editValues.referenceInvoice)
        setVessel(editValues.vessel)
        setContainer(editValues.container)
        setGd(editValues.gd)
        setTerminal(editValues.terminal)
        let tempState = [
          {num:''},
          {num:''},
          {num:''},
        ]
        editValues.contacts.split(', ').forEach((x, index)=>{
          tempState[index].num=x
        });
        setContacts(tempState)
    }, [editValues])

    const converNumToString = (contactArray) => {
      let nums = ''
        contactArray.forEach((x, index)=>{
          if(index<2){
            nums=nums + x.num + ", "
          }else{
            nums=nums + x.num
          }
        })
        return nums
    }

    const handleSubmit = (e) => {
        setLoad(true);
        e.preventDefault();
        axios.post(process.env.NEXT_PUBLIC_SEANET_SYS_EDIT_ORDER_POST,{
            id:id,
            referenceInvoice:referenceInv,
            consignment:consignment,
            vessel:vessel,
            gd:gd,
            contacts:converNumToString(contacts),
            terminal:terminal,
            container:container
        }).then((x)=>{
            if(x.data[0]==1){
                console.log(x)
                let tempValue = editValues
                tempValue.referenceInvoice=referenceInv,
                tempValue.consignment=consignment,
                tempValue.vessel=vessel,
                tempValue.contacts=converNumToString(contacts),
                tempValue.gd=gd,
                tempValue.terminal=terminal,
                tempValue.container=container
                updateShipment(tempValue)
                setLoad(false);
                setVisible(false);
            }
        })
    }

  return (
    <div className={theme=='light'?'lightTheme':'darkTheme'}>
    <Form className='' onSubmit={handleSubmit}>
    <Row>
    <Col>
    <div className='f-30'>Order</div>
    <hr/>
    <Row>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Client</Form.Label>
            <Form.Control type="text" required defaultValue={name} />
        </Form.Group>
      <Col md={6}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Consignment Type</Form.Label>
        <Form.Select aria-label="Default select example" value={consignment} required onChange={(e)=>setConsignment(e.target.value)}>
        <option>--- Select Shipment Type ---</option>
        <option value="FCL">FCL</option>
        <option value="LCL">LCL</option>
        <option value="PART">PART</option>
        <option value="AIR">AIR</option>
        <option value="EPZ(I)">EPZ{'('}I{')'}</option>
        <option value="EPZ(E)">EPZ{'('}E{')'}</option>
        </Form.Select>
      </Form.Group>
      </Col>
      <Col md={6}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Client Reference Invoice</Form.Label>
        <Form.Control type="text" placeholder="Client Ref Inv" required value={referenceInv} onChange={(e)=>setReferenceInv(e.target.value)} />
      </Form.Group>
      </Col>
      
        <Col md={6}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Vessel</Form.Label>
          <Form.Control type="text" placeholder="Vessel" required value={vessel} onChange={(e)=>setVessel(e.target.value)} />
        </Form.Group>
        </Col>
        <Col md={6}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Container No.</Form.Label>
          <Form.Control type="text" placeholder="Container #" required value={container} onChange={(e)=>setContainer(e.target.value)} />
        </Form.Group>
        </Col>
        <Col md={6}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Terminal</Form.Label>
          <Form.Select aria-label="Default select example"
            required value={terminal} onChange={(e)=>setTerminal(e.target.value)} >
            <option>-- Select Terminal --</option>
            <option value={'PICT'} >PICT</option>
            <option value={'KICT'} >KICT</option>
            <option value={'SAPT'} >SAPT</option>
            <option value={'QICT'} >QICT</option>
        </Form.Select>
        </Form.Group>
        </Col>
        <Col md={6}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>GD no.</Form.Label>
          <Form.Control type="text" placeholder="GD #" value={gd} onChange={(e)=>setGd(e.target.value)} />
        </Form.Group>
        </Col>
      </Row>
      <Row>
        <h6>Add Phone Numbers</h6>
        <Col md={4}>
        <PatternFormat 
            format="92##########"
            style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
            mask="-"
            allowEmptyFormatting={true}
            value={contacts[0].num} 
            onChange={(e)=>{
              let tempState = [...contacts];
              tempState[0].num = e.target.value
              setContacts(tempState)
              }}
          />
        </Col>
        <Col md={4}>
        <PatternFormat 
            format="92##########"
            style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
            mask="-"
            allowEmptyFormatting={true}
            value={contacts[1].num} 
            onChange={(e)=>{
              let tempState = [...contacts];
              tempState[1].num = e.target.value
              setContacts(tempState)
              }}
          />
        </Col>
        <Col md={4}>
        <PatternFormat 
            format="92##########"
            style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
            mask="-"
            allowEmptyFormatting={true}
            value={contacts[2].num} 
            onChange={(e)=>{
              let tempState = [...contacts];
              tempState[2].num = e.target.value
              setContacts(tempState)
              }}
          />
        </Col>
      </Row>
    </Col>

    </Row>
    <button className='custom-btn mt-3' disabled={load?true:false} type="submit">{!load?'Submit':<Spinner animation="border" className='mx-3' size="sm" />}</button>
    </Form>
    </div>
  )
}

export default Edit