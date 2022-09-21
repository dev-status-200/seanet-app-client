import React from 'react';
import Dashboard from '/components/Layouts/Dashboard';
import axios from 'axios';
import Cookies from 'cookies';

const dashboard = ({orderData, sessionData}) => {
  return (
    <div>
      <Dashboard orderData={orderData} sessionData={sessionData} />
    </div>
  )
}

export default dashboard
export async function getServerSideProps({req,res}){
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_VERIFY_USER,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);
  const ordersRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_GET_ORDER_GET)
  .then((x)=>x.data);
  return{
      props: { orderData: ordersRequest, revalidate: 10, sessionData:sessionRequest }
  }
}