import '../styles/globals.css';
import 'antd/dist/antd.css';
import '../styles/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react'
import MainLayout from '/components/Shared/MainLayout';
import Loader from '../components/Shared/Loader'
import Router, { useRouter  } from 'next/router';

import { store } from '../redux/store';
import { Provider } from 'react-redux';

import 'mapbox-gl/dist/mapbox-gl.css';

function MyApp({ Component, pageProps:{ session, ...pageProps }, }) {

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  Router.events.on("routeChangeStart", () => { setLoading(true) });
  Router.events.on("routeChangeComplete", () => { setLoading(false)});

  return(
    <>
    { (router.pathname !='/signin' && router.pathname !='/') && 
      <Provider store={store}>
        <MainLayout className='lightTheme'>
            { loading && <Loader/> }
            { !loading && <Component {...pageProps} /> }
        </MainLayout>
      </Provider>
    }
    { (router.pathname =='/signin' || router.pathname =='/') &&
      <>
        { loading && <Loader /> }
        { !loading && <Component {...pageProps} /> }
      </>
    }
    </>
  )
}

export default MyApp
