import React, { useEffect, useState } from 'react';
import {Row, Col, Form, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Create = ({clientData, appendClient, setVisible}) => {  

    const theme = useSelector((state) => state.theme.value);

    const [load, setLoad] = useState(false);

    const [clientId, setClientId] = useState('');
    const [consignment, setConsignment] = useState('');
    const [referenceInv, setReferenceInv] = useState('');
    const [vessel, setVessel] = useState('');
    const [status, setStatus] = useState('');
    const [gd, setGd] = useState('');
    const [container, setContainer] = useState('');
    const [terminal, setTerminal] = useState('');

    const [statuses, setStatuses] = useState([
        {name:'GD Submitted', mark:false},
        {name:'Consignment Moved to Port', mark:false}
    ])

    const handleSubmit = (e) => {
        setLoad(true);
        e.preventDefault();
        axios.post(process.env.NEXT_PUBLIC_SEANET_SYS_CREATE_ORDER_POST,{
            ClientId:clientId,
            referenceInvoice:referenceInv,
            consignment:consignment,
            vessel:vessel,
            gd:gd,
            terminal:terminal,
            container:container,
            status:status
        }).then((x)=>{
            let tempObj = x.data;
            let clientName = clientData.find(obj => {
              return obj.id == x.data.ClientId
            }).name
            tempObj = {
                id: x.data.id, referenceInvoice: x.data.referenceInvoice,
                consignment: x.data.consignment, vessel: x.data.vessel,
                gd:x.data.gd, active:x.data.active,
                status: x.data.status, terminal: x.data.terminal,
                container: x.data.container, ClientId: x.data.ClientId,
                updatedAt: x.data.updatedAt, createdAt: x.data.createdAt,
                Client:{name:clientName}
            }
            appendClient(tempObj);
            setClientId("")
            setConsignment("")
            setReferenceInv("")
            setVessel("")
            setStatus("")
            setGd("")
            setContainer("")
            setTerminal("")
            setStatuses([
              {name:'GD Submitted', mark:false},
              {name:'Consignment Moved to Port', mark:false}
            ])
            setLoad(false);
            setVisible(false);
        })
    }

  return (
    <div className={theme=='light'?'lightTheme':'darkTheme'}>
    <Form className='' onSubmit={handleSubmit}>
    <Row>
    <Col md={8}>
    <div className='f-30'>Shipment</div>
    <hr/>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Client</Form.Label>
        <Form.Select aria-label="Default select example" value={clientId} required onChange={(e)=>setClientId(e.target.value)}>
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
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Client Reference Invoice</Form.Label>
        <Form.Control type="text" placeholder="Client Ref Inv" required value={referenceInv} onChange={(e)=>setReferenceInv(e.target.value)} />
      </Form.Group>
      <Row>
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
                value={status}
                onClick={(e)=>{
                  if(x.mark == true){
                    setStatuses([
                      {name:'GD Submitted', mark:false},
                      {name:'Consignment Moved to Port', mark:false}
                  ])
                  setStatus("")
                  }
                }}
                onChange={(e)=>{
                    let tempState = [...statuses];
                    tempState.forEach((y)=>{
                        if(y.name==x.name){
                            y.mark=true
                            setStatus(y.name)
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