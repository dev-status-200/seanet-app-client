import React from 'react'
//import MapComp from '/components/Layouts/MapComp';
import axios from 'axios';
import Cookies from 'cookies';
import Riders from '/components/Layouts/Tracking/Riders';

const riders = ({sessionData, RidersData}) => {
  return (
    <div>
      <Riders sessionData={sessionData} RidersData={RidersData} />
    </div>
  )
}

export default riders
export async function getServerSideProps({req,res}){
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_VERIFY_USER,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);
  
  const ridersRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_GET_RIDERS_USER,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  return{
      props: { sessionData:sessionRequest, RidersData:ridersRequest }
  }
}