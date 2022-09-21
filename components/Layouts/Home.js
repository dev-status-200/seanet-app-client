import React, {useEffect} from 'react'
import Router from 'next/router'

const Home = ({sessionData}) => {

    useEffect(() => {
      if(sessionData.isLoggedIn==false){
        Router.push('/signin')
      }else if(sessionData.isLoggedIn==true){
        Router.push('/dashboard')
      }
    }, [sessionData]);
    
  return (
    <>
    </>
  )
}

export default Home
