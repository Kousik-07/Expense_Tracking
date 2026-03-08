import React, { useState } from 'react'
import {  Link, redirect, useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from "antd";
import http from '../utils/http';
import { toast } from 'react-toastify';
import { FcGoogle } from "react-icons/fc";
function Login() {

  const [loginForm] = Form.useForm()
  const[loading,setLoading]=useState(false)
  const navigate=useNavigate()
  const onLogin = async (value) => {
    try {
      const { data } = await http.post("/api/user/login", value);
      toast.success("Login done")
      await navigate("/app");
    } catch (error) {
      toast.error(error.response?error.response.data.message:error.message)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl flex w-[70%] overflow-hidden">
        {/* LEFT LOGIN FORM */}
        <div className="md:w-1/2 w-full p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-4">
            Sign in to <span className="font-extrabold">FinTrack</span>
          </h2>
          {/* Google Button */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 border rounded-full flex items-center justify-center text-2xl">
              <FcGoogle />
            </div>
          </div>
          <p className="text-gray-400 text-sm text-center mb-6">
            or use your account
          </p>
          {/* Input Fields */}
          <div className="space-y-4">
            <Form name="login-form" onFinish={onLogin} form={loginForm}>
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

              {/* Forgot Password */}
              <Link to={"/forgetPassword"}>
                <p className="text-center text-sm text-gray-500  cursor-pointer hover:text-green-500">
                  Forgot your password?
                </p>
              </Link>

              {/* Login Button */}
              <div className="flex justify-center mt-3">
                <Button
                  htmlType="submit"
                  className="w-full bg-green-400! hover:bg-green-500! transition! text-white! py-2 rounded-lg!"
                  loading={loading}
                >
                  SIGN IN
                </Button>
              </div>
            </Form>
          </div>
          <Link to={"/signup"}>
            <p className="text-end text-sm text-gray-500  cursor-pointer hover:text-green-500 mt-2 md:hidden">
              Create new account
            </p>
          </Link>
        </div>
        {/* RIGHT PANEL */}
        <div className="hidden w-1/2 bg-linear-to-br from-green-400 to-green-900 text-white md:flex md:flex-col items-center justify-center p-10">
          <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
          <p className="text-center opacity-90 mb-6">
            Enter your personal details and start journey with us
          </p>
          <Link to={"/signup"}>
            <button className="bg-green-400 hover:bg-green-500 px-8 py-2 rounded-lg transition">
              SIGN UP
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login
