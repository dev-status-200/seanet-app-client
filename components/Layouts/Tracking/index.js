import React, { useState, useEffect } from 'react'
import Router from 'next/router';
import { useSelector } from 'react-redux';
import { Row, Col, Table, Spinner } from 'react-bootstrap';
import LineTraceMap from './LineTraceMap';

const Tracking = ({sessionData, RidersData}) => {

  const theme = useSelector((state) => state.theme.value);
  const [riderList, setRiderList] = useState([]);
  const [selectedRider, setSelectedRider] = useState('');
  const [load, setLoad] = useState(false);

    useEffect(() => {
        if(sessionData.isLoggedIn==false){
          Router.push('/signin')
        }
    }, [sessionData]);

    useEffect(() => {
      setRiderList(RidersData);
      console.log(RidersData);
    }, [])

    useEffect(() => {
      setLoad(true);
      setTimeout(()=> setLoad(false), 3000);
      return () => { }
    }, [selectedRider])

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
                  <div key={index} className={`rider-row ${selectedRider.id==rider.id?'rider-selected':''}`}
                      onClick={()=>{
                        load?null:setSelectedRider(rider)
                        }}>
                    <span><img src={'/assets/ridericon.png'} height={30} /></span>
                    <span className='f-15 mx-2 fw-500'>{rider.f_name} {rider.l_name}</span>
                    <div>Status: {rider.Job.job_active==0?<span style={{color:'green', backgroundColor:'#aac99c', padding:'0px 10px 4px 10px', borderRadius:10}}>Complete</span>:
                    <span style={{color:'#7e6407', backgroundColor:'rgba(184, 146, 10, 0.53)', padding:'0px 15px 4px 15px', borderRadius:10}}>On Job</span>}</div>
                  </div>
                )
              })}
            </Col>
            <Col md={9}>
              {selectedRider!=''&& 
              <>
              {load&&
              <div style={{width:'70vw', height:'62vh', border:'1px solid silver', borderRadius:5, backgroundColor:'rgba(117, 156, 163, 0.7)', position:'absolute', zIndex:1}}>
              <div style={{position:'relative', top:'40%', textAlign:'center'}}>
                <Spinner animation="border" className='mx-3' style={{height:70, width:70, color:'rgba(6, 94, 116, 1)'}}  />
              </div>
              </div>
              }
                
                <LineTraceMap selectedRider={selectedRider} />
              </>
              }
              {selectedRider==''&& 
                <div style={{width:'70vw', height:'62vh', border:'1px solid silver', borderRadius:5, backgroundColor:'rgba(117, 156, 163, 0.7)'}}>
                  <h1 style={{textAlign:'center', marginTop:'30%', fontWeight:'700', color:'rgba(6, 94, 116, 1)'}}>Please Select A Rider To Track</h1>
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