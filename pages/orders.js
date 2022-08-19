import React from 'react'
import Orders from '../components/Layouts/Orders'
import axios from 'axios'

const orders = ({clientData}) => {
  return (
    <div>
      <Orders clientData={clientData} />
    </div>
  )
}

export default orders

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