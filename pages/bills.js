import React from 'react';
import axios from 'axios';
import Cookies from 'cookies';
import Bills from '/components/Layouts/Bills';

const bills = ({shipmentData, sessionData}) => {
  return (
    <div>
      <Bills sessionData={sessionData} shipmentData={shipmentData} />
    </div>
  )
}

export default bills

export async function getServerSideProps({req,res}){
    const cookies = new Cookies(req, res)
    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_VERIFY_USER,{
      headers:{"x-access-token": `${cookies.get('token')}`}
    }).then((x)=>x.data);
  
    const shipmentReq = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_COMPLETED_SHIPMENT_GET).then((x)=>x.data);
    return{
        props: { shipmentData: shipmentReq, sessionData:sessionRequest }
    }
}