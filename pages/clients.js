import React from 'react';
import Clients from '../components/Layouts/Clients';
import axios from 'axios';
import Cookies from 'cookies'

const clients = ({clientData, sessionData}) => {
  return (
    <>
      <Clients clientData={clientData} sessionData={sessionData} />
    </>
  )
}
export default clients

export async function getServerSideProps({req,res}){
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_VERIFY_USER,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  const cleintRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_GET_CLIENTS_GET).then((x)=>x.data);
  return{
      props: { clientData: cleintRequest, sessionData:sessionRequest }
  }
}