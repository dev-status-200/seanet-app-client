import React from 'react'
import Dashboard from '/components/Layouts/Dashboard'
import axios from 'axios'

const dashboard = ({orderData}) => {
  return (
    <div>
      <Dashboard orderData={orderData} />
    </div>
  )
}

export default dashboard
export async function getServerSideProps({req,res}){
  //const cookies = new Cookies(req, res)
  const ordersRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_GET_ORDER_GET)
  .then((x)=>x.data);
  return{
      props: { orderData: ordersRequest, revalidate: 10 }
  }
}