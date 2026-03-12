import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import http from '../utils/http';
import { Button, Form, Input, message } from "antd";
import Password from 'antd/es/input/Password';
import {toast} from "react-toastify"

import GoogleAuth from './Shared/GoogleAuth';
function Signup() {
  const [signupForm]=Form.useForm()
  const [formData,setFormData]=useState(null)
  const [otp,setOtp]=useState(null)
  const [loading,setLoading]=useState(false)

  const navigate=useNavigate()
  const onFinish = async (values) => {
    // e.preventDefault();
    try {
      setLoading(true)
      const { data } = await http.post("/api/user/send-mail", values);
      toast.success("Mail send successfully")
      setOtp(data.otp);
      setFormData(values)
    } catch (error) {
      toast.error(error.response?error.response.data.message:error.message)
      setOtp(null)
      setFormData(null)
    } finally {
      setLoading(false);
    }
  };

  const onSignup = async(values) => {
    try {
      if (Number(values.otp)!==Number(otp)) {
        return toast.error("otp not match")
      }
      setLoading(true);
      await http.post("/api/user/signup", formData);
      toast.success("Signup success, please login")
      navigate("/login")
      setOtp(null);
      setFormData(null);
      signupForm.resetFields()
    } catch (error) {
      
      toast.error(error.response?error.response.data.message:error.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl md:flex w-[70%] overflow-hidden">
          {/* Left Panel */}
          <div className="w-1/2 bg-linear-to-br from-green-400 to-green-900 text-white p-12 md:flex md:flex-col justify-center hidden">
            <h1 className="text-3xl font-bold mb-4">FinTrack</h1>
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-sm mb-6 opacity-90">
              Log in to manage your finances.
            </p>
            <Link to={"/login"}>
              <button className="bg-green-400 hover:bg-green-500 transition px-6 py-2 rounded-lg w-fit">
                SIGN IN
              </button>
            </Link>
          </div>
          {/* Right Panel */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-center mb-2">
              Create Account
            </h2>
            {/* Google Icon */}
            <div className="flex justify-center mb-4">
              <GoogleAuth/>
            </div>
            <p className="text-center text-gray-400 text-sm mb-6">
              or use your email for registration
            </p>
            {/* Form */}
            {otp ? (
              <Form
                onFinish={onSignup}
                name="opt-form"
                layout="vertical"
                className="flex flex-col items-center space-y-4 "
              >
                <Form.Item name="otp" label="Enter OTP:">
                  <Input.OTP length={6} />
                </Form.Item>
                <button
                  loading={loading}
                  type="submit"
                  className="w-1/2 bg-green-400 hover:bg-green-500 transition text-white py-2 rounded-lg mt-2"
                >
                  varify now
                </button>
              </Form>
            ) : (
              <Form
                name="signup-form"
                onFinish={onFinish}
                className="space-y-4"
                form={signupForm}
              >
                <Form.Item name="fullname" rules={[{ required: true }]}>
                  <Input
                    placeholder="Name"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[{ required: true, type: "email" }]}
                >
                  <Input
                    placeholder="Email"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true }]}>
                  <Input.Password
                    placeholder="password"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </Form.Item>
                  <Form.Item name="mobile"
                    rules={[{ required: true },{pattern:/^[0-9]+$/, message:"Enter valid mobile number"}]}>
                  <Input
                    type="Number"
                      placeholder="mobile"
                      maxLength={10}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </Form.Item>

                <Button
                  htmlType="submit"
                  loading={loading}
                  className="w-full bg-green-400! hover:bg-green-500! transition! text-white! py-2 rounded-lg! mt-2"
                >
                  SIGN UP
                </Button>
                <Link to={"/login"}>
                  <p className="text-end text-sm text-gray-500  cursor-pointer hover:text-green-500 md:hidden">
                    Already have an account?
                  </p>
                </Link>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup
