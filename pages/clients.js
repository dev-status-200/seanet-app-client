import React from 'react';
import Clients from '../components/Layouts/Clients';
import axios from 'axios';

const clients = ({clientData}) => {
  return (
    <div>
      <Clients clientData={clientData} />
    </div>
  )
}
export default clients

export async function getServerSideProps({req,res}){
  //const cookies = new Cookies(req, res)
  const cleintRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_GET_CLIENTS_GET,{
      // headers:{
      //     "x-access-token": `${cookies.get('token')}`
      // }
  }).then((x)=>x.data);
  return{
      props: { clientData: cleintRequest }
  }
}