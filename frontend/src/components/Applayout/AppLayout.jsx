import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { Navigate, Outlet,  } from 'react-router-dom'
import useSWR from "swr"
import fetcher from '../../utils/fetcher'
import Loader from '../Shared/Loader'

function AppLayout() {
 
  
  return (
    <div>
          <Header />
         <Outlet/>
          <Footer/>
    </div>
  )
}

export default AppLayout
