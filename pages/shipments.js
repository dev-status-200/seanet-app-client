import React from 'react'
import Shipments from '../components/Layouts/Shipments'
import axios from 'axios';
import Cookies from 'cookies';

const orders = ({clientData, orderData, sessionData}) => {
  return (
    <div>
      <Shipments clientData={clientData} orderData={orderData} sessionData={sessionData} />
    </div>
  )
}
export default orders

export async function getServerSideProps({req,res}){
  const cookies = new Cookies(req, res)

  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_VERIFY_USER,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  const cleintRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_GET_CLIENTS_GET).then((x)=>x.data);
  const ordersRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_GET_ORDER_GET)
  .then((x)=>x.data);
  return{
      props: { clientData: cleintRequest, orderData: ordersRequest, revalidate: 10, sessionData:sessionRequest }
  }
}
