import React, { useEffect, useState } from 'react'
import {Row, Col, Form, Spinner } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import axios from 'axios'

const Create = ({clientData}) => {  

    const theme = useSelector((state) => state.theme.value);

    const [load, setLoad] = useState(false);

    const [referenceInv, setReferenceInv] = useState('');
    const [consignment, setConsignment] = useState('');
    const [clientId, setClientId] = useState('');
    const [vessel, setVessel] = useState('');
    const [status, setStatus] = useState('');
    const [gd, setGd] = useState('');

    const [statuses, setStatuses] = useState([
        {name:'GD Submitted', mark:false},
        {name:'Consignment Moved to Port', mark:false},
        {name:'Gate Pass Issued', mark:false},
        {name:'Pass In', mark:false},
        {name:'Mark For Assessment', mark:false}
    ])

    const handleSubmit = (e) => {
        setLoad(true);
        e.preventDefault();
        axios.post(process.env.NEXT_PUBLIC_SEANET_SYS_CREATE_ORDER_POST,{
            CleintId:clientId,
            referenceInvoice:referenceInv,
            consignment:consignment,
            vessel:vessel,
            gd:gd,
            status:status
        }).then((x)=>{
            console.log(x.data);
            //appendClient(x.data);
            setLoad(false);
            //setVisible(false);
        })
    }
  return (
    <div className={theme=='light'?'lightTheme':'darkTheme'}>
    
    <Form className='' onSubmit={handleSubmit}>
    <Row>
    <Col md={8}>
    <div className='f-30'>Order</div>
    <hr/>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Client</Form.Label>
        <Form.Select aria-label="Default select example">
            <option>--- Select Client ---</option>
            {
            clientData.map((client, index)=>{
                return(
                <option value={client.id} key={index}>{client.name}</option>
                )
            })}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Consignment Type</Form.Label>
        <Form.Select aria-label="Default select example">
        <option>--- Select Shipment Type ---</option>
        <option value="FCL">FCL</option>
        <option value="LCL">LCL</option>
        <option value="PART">PART</option>
        <option value="AIR">AIR</option>
        <option value="EPZ(I)">EPZ{'('}I{')'}</option>
        <option value="EPZ(E)">EPZ{'('}E{')'}</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Client Reference Invoice</Form.Label>
        <Form.Control type="text" placeholder="Client Ref Inv" required value={name} onChange={(e)=>setName(e.target.value)} />
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Vessel</Form.Label>
        <Form.Control type="text" placeholder="Vessel" required value={name} onChange={(e)=>setName(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>GD no.</Form.Label>
        <Form.Control type="text" placeholder="GD#" required value={name} onChange={(e)=>setName(e.target.value)} />
      </Form.Group>
    </Col>
    <Col>
    <div className='f-30'>Status</div>
    <hr/>
    {
        statuses.map((x,index)=>{
            return(
            <Form.Check 
                key={index} type={'radio'} label={`${x.name}`}
                checked={x.mark?true:false} id={`${index+1}`}
                value={x.name}
                onChange={(e)=>{
                    let tempState = [...statuses];
                    tempState.forEach((y)=>{
                        if(y.name==x.name){
                            y.mark=true
                        }else{
                            y.mark=false
                        }
                    })
                    setStatuses(tempState)
                }}
            />
            )
        })
    }
    </Col>
    </Row>
    <button className='custom-btn' disabled={load?true:false} type="submit">{!load?'Submit':<Spinner animation="border" className='mx-3' size="sm" />}</button>
    </Form>
    </div>
  )
}

export default Create
