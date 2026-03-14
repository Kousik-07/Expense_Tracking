import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR, { mutate } from "swr";
import fetcher from "../utils/fetcher.js";
import http from "../utils/http.js";
import { toast } from "react-toastify";
import UpdateUser from "./UpdateUser.jsx";
import { MdDeleteForever } from "react-icons/md";

function Profile() {
  const { data: user, error } = useSWR("/api/user/getdata", fetcher);

  const userId = user?._id;

  const [showEditUserName, setShowEditUserName] = useState(false);
  const [showEditUserMobile, setShowEditUserMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setLoading(true);

      const res = await http.put(`/api/user/uploadFile/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        mutate("/api/user/getdata");
        toast.success("Profile picture updated!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handelDelete = async () => {
    try {
     setLoading(true)
     const res = await http.delete(`/api/user/deleteProfileImage/${userId}`);

     if (res.data.success) {
       mutate("/api/user/getdata");
       setLoading(false)
       toast.success("Profile image deleted");
     }
   } catch (error) {
     console.error(error);
     toast.error("Failed to delete image");
   }
  }


  return (
    <div className="p-4 md:p-10 min-h-screen">
      {/* PAGE TITLE */}
      <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8">
        My Profile
      </h2>

      {/* PROFILE GRID */}
      <div className="flex flex-col justify-center items-center">
        {/* PROFILE CARD */}
        <div className="bg-gray-100 w-full sm:w-[80%] md:w-[60%] lg:w-[50%] flex justify-center items-center flex-col gap-4 rounded-xl shadow p-6 md:p-8">
          {/* AVATAR */}
          <div className="flex justify-center mb-4">
            {user?.profileImage ? (
              <div className="relative">
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-24 h-24 md:w-30 md:h-30 rounded-full object-cover"
                />
                <div onClick={handelDelete} className="absolute top-2 right-0 text-xl md:text-2xl text-red-300 hover:text-red-400 active:text-red-600 cursor-pointer">
                  <MdDeleteForever />
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-2xl md:text-3xl">👤</span>
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={"/forgetPassword"}>
              <button className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                Change Password
              </button>
            </Link>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="upload-button"
            />

            <label
              htmlFor="upload-button"
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-500 cursor-pointer text-center"
            >
              {loading ? "Processing..." : "Change Photo"}
            </label>
          </div>

          {/* NAME */}
          <h3 className="text-base md:text-lg font-semibold text-center">
            Name: <span className="text-gray-500">{user?.fullname}</span>
            <button
              className="cursor-pointer ml-1"
              onClick={() => setShowEditUserName(true)}
            >
              🖋️
            </button>
          </h3>

          {/* MOBILE */}
          <h3 className="text-base md:text-lg font-semibold text-center">
            Mobile Number: <span className="text-gray-500">{user?.mobile}</span>
            <button
              className="cursor-pointer ml-1"
              onClick={() => setShowEditUserMobile(true)}
            >
              🖋️
            </button>
          </h3>

          <p className="text-gray-500 text-sm text-center">
            Email: {user?.email}
          </p>
        </div>

        {showEditUserName && (
          <UpdateUser
            title="Edit user name"
            type="text"
            name="fullname"
            userdata={userId}
            placeholder="Enter full name"
            buttonText="Change Name"
            onClose={() => setShowEditUserName(false)}
          />
        )}

        {showEditUserMobile && (
          <UpdateUser
            title="Edit mobile number"
            type="text"
            name="mobile"
            userdata={userId}
            placeholder="Enter mobile number"
            buttonText="Change Number"
            onClose={() => setShowEditUserMobile(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;
