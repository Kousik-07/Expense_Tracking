import React, { useEffect, useState } from 'react'
import http from '../utils/http';
import Loader from '../components/Shared/Loader';
import { Navigate } from 'react-router-dom';
const Guard=({endpoint,children})=> {
    const [authorised, setAuthorised] = useState(false)
    const [loader, setLoader] = useState(true);
    
    useEffect(() => {
        const verifyToken = async() => {
           try {
             const { data } = await http.get(endpoint)
            sessionStorage.setItem("userInfo", JSON.stringify(data))
            setAuthorised(true)
            setLoader(false)
           } catch (err) {
            setAuthorised(false);
            setLoader(false);
           }
        }
        verifyToken()
    }, [endpoint])
    if (loader) {
        return <Loader/>
    }
    if (authorised) {
        return children
    } else {
        return <Navigate to={"/"}/>
    }
}

export default Guard
