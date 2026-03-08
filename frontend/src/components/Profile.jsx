
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../utils/fetcher';

function Profile() {

  const { data: user, error } = useSWR(
    "/api/user/getdata",
    fetcher
  )
  // console.log(user);
  
  return (
    <div className="p-10">
      {/* PAGE TITLE */}
      <h2 className="text-2xl font-semibold mb-8">My Profile</h2>
      {/* PROFILE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* PROFILE CARD */}
        <div className="bg-white rounded-xl shadow p-8 text-center">
          {/* AVATAR */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-3xl">👤</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold">Name: {user?.fullname}</h3>
          <p className="text-gray-500 text-sm mt-1">
            Email: {user?.email}
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 cursor-pointer">
              Edit Profile
            </button>
            <Link to={"/forgetPassword"}>
              <button className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300 cursor-pointer">
                Change Password
              </button>
            </Link>
          </div>
        </div>
        {/* SETTINGS CARD */}
        <div className="bg-white rounded-xl shadow p-8">
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">Preferred Currency:</span>
              <span>INR (₹)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Language:</span>
              <span>English (EN)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Monthly Start Date:</span>
              <span>1st of every month</span>
            </div>
            {/* NOTIFICATION */}
            <div>
              <p className="font-medium mb-2">Notifications Preferences:</p>
              <div className="space-y-2 ml-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-green-500"
                  />
                  Budget Limit Alerts
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-green-500"
                  />
                  Goal Reminders
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-green-500"
                  />
                  Weekly Summary Emails
                </label>
              </div>
            </div>
          </div>
          {/* ACTION BUTTONS */}
          <div className="flex gap-4 mt-8">
            <button className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600">
              Export Data
            </button>
            <button className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600">
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile
