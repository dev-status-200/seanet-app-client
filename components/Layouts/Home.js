import React, {useEffect} from 'react'
import Router from 'next/router'

const Home = () => {

    useEffect(() => {
        Router.push('/signin')
    }, [])
    
  return (
    <div>
      
    </div>
  )
}

export default Home
