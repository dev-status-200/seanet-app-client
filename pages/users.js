import React from 'react'
import Users from '../components/Layouts/Users'
import axios from 'axios'

const users = ({userData}) => {
  return (
    <div>
      <Users userData={userData} />
    </div>
  )
}
export default users

export async function getServerSideProps(context){
    //const cookies = new Cookies(req, res)
    console.log(context.query.id)
    const request = await axios.get(process.env.NEXT_PUBLIC_SEANET_SYS_GET_ALL_USERS_GET,{
        // headers:{
        //     "id": `${context.query.id}`
        // }
    }).then((x)=>x.data);
    return{
        props: { userData: request }
    }
  }