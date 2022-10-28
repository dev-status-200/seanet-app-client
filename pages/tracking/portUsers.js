import React from 'react'
//import MapComp from '/components/Layouts/MapComp';
import axios from 'axios';
import Cookies from 'cookies';
import PortUserComp from '/components/Layouts/Tracking/PortUserComp';

const portUsers = ({sessionData, PortUsers}) => {
  return (
    <div>
      <PortUserComp sessionData={sessionData} PortUsers={PortUsers} />
    </div>
  )
}

export default portUsers
export async function getServerSideProps({req,res}){
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_VERIFY_USER,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  const portUsersRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_GET_PORT_USER,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  return{
      props: { sessionData:sessionRequest, PortUsers:portUsersRequest }
  }
}