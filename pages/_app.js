import '../styles/globals.css';
import 'antd/dist/antd.css';
import '../styles/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react'
import MainLayout from '/components/Shared/MainLayout';

import { store } from '../redux/store';
import { Provider } from 'react-redux'

function MyApp({ Component, pageProps }) {

  return(
    <>
    <Provider store={store}>
    <MainLayout className='lightTheme'>
        <Component {...pageProps} />
      </MainLayout>
  </Provider>
      
    </>
  )
}

export default MyApp
