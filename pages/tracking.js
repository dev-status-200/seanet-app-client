import React from 'react'
import CustomerTracking from '../components/Layouts/CustomerTracking'
import axios from 'axios'

const tracking = ({clientData}) => {
  return (
    <div>
      <CustomerTracking clientData={clientData} />
    </div>
  )
}

export default tracking


export async function getServerSideProps(context){
  //const cookies = new Cookies(req, res)
  console.log(context.query.id)
  const request = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_CLIENT_ORDER_CHECK_GET,{
      headers:{
          "id": `${context.query.id}`
      }
  }).then((x)=>x.data);
  return{
      props: { clientData: request }
  }
}