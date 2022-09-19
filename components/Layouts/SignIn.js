import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Alert } from 'react-bootstrap'
import Router from 'next/router'
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode'

const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) =>{
    e.preventDefault(e);
    setLoad(true)
    axios.post(process.env.NEXT_PUBLIC_SEANET_SYS_LOGIN_POST,{
      email:email,
      password:password,
      contact:''
    }).then((x)=>{
      if(x.data.message=='Success'){
        let token = jwt_decode(x.data.token);
        console.log(token);
        Cookies.set('token', x.data.token, { expires: 1 });
        Cookies.set('username', token.username, { expires: 1 });
        Cookies.set('loginId', token.loginId, { expires: 1 });
        Cookies.set('type', token.type, { expires: 1 });
        Cookies.set('permissions', JSON.stringify(token.per), { expires: 1 });
        Router.push('/dashboard');
      }else if(x.data.message=='Invalid'){
        setLoad(false);
        setError(true);
        //console.log(JSON.parse(Cookies.get('permissions')))
      }
    })
  }

  return (
    <div className='bg-signin'>
      <form className='signin-card' onSubmit={handleSubmit}>
        <div>
        </div>
            <img src={'/assets/logo.png'} height={100} />
            {!error&&<div className='f-30 fw-800' style={{marginBottom:'25px'}}>USER LOGIN</div>}
            {error&&<Alert style={{margin:'0px 400px 15px 400px', opacity:'0.8'}} key={'danger'} variant={'danger'}>
              Wrong email or password
            </Alert>}
            <div className='mb-4'>
                <input className='inp' type='email' required placeholder='Enter your email...' value={email} onChange={(e)=>setEmail(e.target.value)} />
                <img src={'/assets/username.png'} className='username-img' height={55} />
            </div>
            <div className='mt-4'>
                <input className='inp' placeholder='Enter your password...' required type={reveal?'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} />
                <img src={reveal?'/assets/pass.png':'/assets/locked.png'} className='username-img' style={{cursor:'pointer'}} height={55} onClick={()=>setReveal(!reveal)} />
            </div>
            <div className='my-4'>
                <button type='submit' className='login-btn'>{load?<Spinner animation="border" className='mx-3' size='sm' variant="light" />:'LOGIN'}</button>
            </div>
      </form>
    </div>
  )
}

export default SignIn