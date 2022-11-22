import React from 'react';
import PaymentReq from '../components/Layouts/PaymentReq';
import axios from 'axios';
import Cookies from 'cookies'

const paymentRequest = ({sessionData, payRequestData, adminData}) => {
  return (
    <div>
      <PaymentReq sessionData={sessionData} payRequestData={payRequestData} adminData={adminData} />
    </div>
  )
}

export default paymentRequest
//NEXT_PUBLIC_GET_USER_PAYMENT_REQUEST_GET

export async function getServerSideProps({req,res}){
    const cookies = new Cookies(req, res)
    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_VERIFY_USER,{
      headers:{"x-access-token": `${cookies.get('token')}`}
    }).then((x)=>x.data);
    const payRequests = await axios.get(process.env.NEXT_PUBLIC_GET_USER_PAYMENT_REQUEST_GET,{
      headers:{"UserId": `${cookies.get('loginId')}`, "type":`${cookies.get('type')}` }
    }).then((x)=>x.data);
    
    const adminsRequests = await axios.get(process.env.NEXT_PUBLIC_GET_ALL_ADMINS).then((x)=>x.data);
  
    return{
        props: { sessionData: sessionRequest, payRequestData:payRequests, adminData:adminsRequests }
    }
  }