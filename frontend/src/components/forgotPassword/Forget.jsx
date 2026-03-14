import React, { useEffect, useState } from "react";
import { Link, redirect, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { toast } from "react-toastify";
import http from "../../utils/http";
function Forget() {
  const [params] = useSearchParams()
  const [forgetForm] = Form.useForm();
  const [repassWord] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tok = params.get("token")
    
    if (tok) {
      checkToken(tok)
    }
    else setToken(null)
  }, [params])
  
  const checkToken = async (tok) => {
    try {
      await http.post(
        "/api/user/verify-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        }
      );
      setToken(tok)
    } catch (error) {
      setToken(null)
    }
  }

  const onForgetPassword = async (value) => {
    try {
      setLoading(true);
      await http.post("/api/user/forget-password", value);
      toast.success("Please check email for forget");
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };
  const onChangePassword = async (value) => {
    try {
      if (value.password !== value.repassword) {
        return toast.warning("Please enter same password")
      }
      setLoading(true);
      await http.put("/api/user/change-password", value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Password Updated Successfully, please wait ")
      setTimeout(() => {
        navigate("/login")
      },3000);
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl flex w-[70%] md:w-[70%] overflow-hidden">
        {/* LEFT LOGIN FORM */}
        <div className="md:w-1/2 w-full p-12 flex flex-col justify-center">
          {token ? (
            <h2 className="text-3xl font-bold text-center mb-4">
              Change Password
            </h2>
          ) : (
            <h2 className="text-3xl font-bold text-center mb-4">
              Forget Password
            </h2>
          )}
          
          {/* Input Fields */}
          <div className="space-y-4">
            {token ? (
              <Form
                name="forget-Form"
                onFinish={onChangePassword}
                form={repassWord}
              >
                <Form.Item name="password" rules={[{ required: true }]}>
                  <Input.Password
                    placeholder="password"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </Form.Item>
                <Form.Item name="repassword" rules={[{ required: true }]}>
                  <Input.Password
                    placeholder="Re-Enter password"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </Form.Item>

                <Link to={"/login"}>
                  <p className="text-center text-sm text-gray-500  cursor-pointer hover:text-green-500">
                    Sign In
                  </p>
                </Link>
                {/* Change Password Button */}
                <div className="flex justify-center mt-3">
                  <Button
                    loading={loading}
                    htmlType="submit"
                    className="w-full bg-green-400! hover:bg-green-500! transition! text-white! py-2 rounded-lg!"
                  >
                    Change Password
                  </Button>
                </div>
              </Form>
            ) : (
                
              <Form
                name="forget-Form"
                onFinish={onForgetPassword}
                form={forgetForm}
              >
                <Form.Item
                  name="email"
                  rules={[{ required: true, type: "email" }]}
                >
                  <Input
                    placeholder="Enter email"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </Form.Item>

                {/* Forgot Password */}
                <Link to={"/login"}>
                  <p className="text-center text-sm text-gray-500  cursor-pointer hover:text-green-500">
                    Sign In
                  </p>
                </Link>

                {/* Login Button */}
                <div className="flex justify-center mt-3">
                  <Button
                    loading={loading}
                    htmlType="submit"
                    className="w-full bg-green-400! hover:bg-green-500! transition! text-white! py-2 rounded-lg!"
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            )}
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

export default Forget;
