import React from 'react';
import Users from '../components/Layouts/Users';
import axios from 'axios';
import Cookies from 'cookies';

const users = ({outDoorUserData, userData, sessionData}) => {
  return (
    <div>
      <Users userData={userData} sessionData={sessionData} outDoorUserData={outDoorUserData} />
    </div>
  )
}
export default users

export async function getServerSideProps({req,res}){
    const cookies = new Cookies(req, res)

    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_VERIFY_USER,{
      headers:{"x-access-token": `${cookies.get('token')}`}
    }).then((x)=>x.data);
    const userReq = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_GET_ALL_USERS_GET).then((x)=>x.data);
    const outDoorUserReq = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_GET_RIDERS_USER).then((x)=>x.data);

    return{
        props: { userData: userReq, sessionData:sessionRequest, outDoorUserData:outDoorUserReq }
    }
  }