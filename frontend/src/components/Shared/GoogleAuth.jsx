import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import http from '../../utils/http';
function GoogleAuth() {
    const navigate = useNavigate();
    const responseGoogle = async(authResult) => {
        try {
            if (authResult["code"]) {
              console.log("Authorization Code:", authResult["code"]);

              const response = await http.post(
                "/api/user/google-login",
                {
                  code: authResult["code"],
                },
                { withCredentials: true }
              );

              
                toast.success("Login Successful!");
                navigate("/app");
              
            }
            
        } catch (error) {
            console.error("Error during Google Login:", error);
            toast.error("Google Login failed. Please try again.");
        }
    }

    const googleLog = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow:'auth-code'
    })
        
    
  return (
    <div>
          <div className="w-10 h-10 flex items-center justify-center border rounded-full text-2xl">
              <button onClick={googleLog}>
                <FcGoogle/>
              </button>
        </div>
    </div>
  )
}

export default GoogleAuth
