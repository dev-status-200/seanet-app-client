import React, { useState, useEffect } from 'react'
import Router from 'next/router';
import { useSelector } from 'react-redux';
import { Row, Col, Table } from 'react-bootstrap';
import Map from './Map';

const Tracking = ({sessionData, RidersData}) => {

  const theme = useSelector((state) => state.theme.value);
  const [riderList, setRiderList] = useState([])
  const [selectedRider, setSelectedRider] = useState('')

    useEffect(() => {
        if(sessionData.isLoggedIn==false){
          Router.push('/signin')
        }
    }, [sessionData]);

    useEffect(() => {
      setRiderList(RidersData);
    }, [])
      
  return (
    <div className={theme=='light'?'lightTheme':'darkTheme'}>
      <div className='box m-3' style={{height:'80vh'}}>
        <Row>
        <Col md={12}>
          <h3 className='f my-2'>Track Riders</h3>
          <hr/>
        </Col>
        </Row>
        <Row>
        <Col md={12}>
          <Row>
            <Col md={2}>
              {riderList.map((rider, index)=>{
                return(
                  <div key={index} className='rider-row' onClick={()=>setSelectedRider(rider.id)}>
                    <span><img src={'/assets/ridericon.png'} height={20} /></span>
                    <span className='f-15 mx-2'>{rider.f_name} {rider.l_name}</span>
                  </div>
                )
              })}
            </Col>
            <Col md={9}>
              {selectedRider!=''&& <Map selectedRider={selectedRider} />}
              {selectedRider==''&& 
                <div style={{width:'70vw', height:'62vh', border:'1px solid silver', borderRadius:5}}>
                  <h4 style={{textAlign:'center', marginTop:'20%'}}>Please Select A Rider To Track</h4>
                </div>
              }
            </Col>
          </Row>
        </Col>
        </Row>
      </div>
    </div>
  )
}

export default Tracking