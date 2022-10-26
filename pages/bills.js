import React from 'react';
import axios from 'axios';
import Cookies from 'cookies';
import Bills from '/components/Layouts/Bills';

const bills = ({orderData, sessionData}) => {
  return (
    <div>
      <Bills sessionData={sessionData} orderData={orderData} />
    </div>
  )
}

export default bills

export async function getServerSideProps({req,res}){
    const cookies = new Cookies(req, res)
    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_VERIFY_USER,{
      headers:{"x-access-token": `${cookies.get('token')}`}
    }).then((x)=>x.data);
  
    const requestOne = await axios.get(process.env.NEXT_PUBLIC_TEST_BILLS_SHOW_ORDERS_GET,{}).then((x)=>x.data);
    return{
        props: { sessionData:sessionRequest, orderData: requestOne, }
    }
}
