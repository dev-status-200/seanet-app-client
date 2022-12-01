import React, { useState, useEffect } from 'react'
import Router from 'next/router';
import { useSelector } from 'react-redux';
import { Row, Col, Table, Spinner } from 'react-bootstrap';
import LocationTraceMap from './LocationTraceMap';
import Link from 'next/link'

const PortUserComp = ({sessionData, PortUsers}) => {

  const theme = useSelector((state) => state.theme.value);
  const [portUser, setPortUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [load, setLoad] = useState(false);

    useEffect(() => {
        if(sessionData.isLoggedIn==false){
          Router.push('/signin')
        }
    }, [sessionData]);

    useEffect(() => {
      setPortUser(PortUsers);
    },[])

    useEffect(() => {
      setLoad(true);
      setTimeout(()=> setLoad(false), 3000);
      return () => { }
    }, [selectedUser])

  return (
    <div className={theme=='light'?'lightTheme':'darkTheme'}>
      <div className='box m-3' style={{height:'80vh'}}>
        <Row>
        <Col md={12}>
          <h3 className='f my-2'>Live Tracking</h3>
          <Link href='/tracking/riders'><a>Switch To Route Tracking</a></Link>
          <hr/>
        </Col>
        </Row>
        <Row>
        <Col md={12}>
          <Row>
            <Col md={2}>
              {portUser.map((user, index)=>{
                return(
                  <div key={index} className={`rider-row ${selectedUser.id==user.id?'rider-selected':''}`}
                      onClick={()=>{
                        load?null:setSelectedUser(user)
                        }}>
                    <span><img src={'/assets/locationmarker.png'} height={30} /></span>
                    <span className='f-15 mx-2 fw-500'>{user.f_name} {user.l_name}</span>
                    <div>Status: {user.Job.job_active==0?<span style={{color:'green', backgroundColor:'#aac99c', padding:'0px 10px 4px 10px', borderRadius:10}}>Complete</span>:
                    <span style={{color:'#7e6407', backgroundColor:'rgba(184, 146, 10, 0.53)', padding:'0px 15px 4px 15px', borderRadius:10}}>On Job</span>}</div>
                  </div>
                )
              })}
            </Col>
            <Col md={9}>
              {selectedUser!=''&& 
              <>
              {load&&
              <div style={{width:'70vw', height:'62vh', border:'1px solid silver', borderRadius:5, backgroundColor:'rgba(117, 156, 163, 0.7)', position:'absolute', zIndex:1}}>
              <div style={{position:'relative', top:'40%', textAlign:'center'}}>
                <Spinner animation="border" className='mx-3' style={{height:70, width:70, color:'rgba(6, 94, 116, 1)'}}  />
              </div>
              </div>
              }
                <LocationTraceMap selectedUser={selectedUser} />
              </>
              }
              {selectedUser==''&& 
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

export default PortUserComp