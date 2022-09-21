import React from 'react';
import Home from '../components/Layouts/Home';
import axios from 'axios';
import Cookies from 'cookies';

const index = ({sessionData}) => {
  return (
    <div>
        <Home sessionData={sessionData} />
    </div>
  )
}

export default index

export async function getServerSideProps({req,res}){
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_VERIFY_USER,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  return{
      props: { sessionData:sessionRequest }
  }
}