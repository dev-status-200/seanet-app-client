import React from 'react'
import MapComp from '../components/Layouts/MapComp';
import axios from 'axios';
import Cookies from 'cookies';

const maps = ({sessionData}) => {
  return (
    <div>
      <MapComp sessionData={sessionData} />
    </div>
  )
}

export default maps
export async function getServerSideProps({req,res}){
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_VERIFY_USER,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  return{
      props: { sessionData:sessionRequest }
  }
}