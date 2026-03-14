import React, { useEffect, useRef, useState } from 'react'
import Draggable from "react-draggable";

import { mutate } from "swr";
import { toast } from "react-toastify";
import http from '../utils/http';
function UpdateUser({
  title,
  buttonText,
  name,
  type,
  placeholder,
  userdata,
  onClose,
}) {
  const nodeRef = useRef(null);
  const [category, setCategory] = useState("");

  // console.log({userdata});

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      console.log(data);

      await http.put(`/api/user/updateuser/${userdata}`, data);
      mutate("/api/user/getdata");
        toast.success("changing successfully");
        onClose()
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  return (
    <div>
      <Draggable nodeRef={nodeRef} handle=".drag-handl">
        {/* Card Container */}
        <div
          ref={nodeRef}
          className="bg-white w-[90%] md:w-[40%] rounded-2xl p-10 shadow-2xl absolute top-1/2 left-1/2 -translate-1/2 "
        >
          {/* Title */}
          <div className="w-[90%] h-10 absolute top-0 drag-handl"></div>
          <h2 className="text-3xl font-semibold mb-8">{title}</h2>
          {/* Form */}
          <form onSubmit={handelSubmit}>
            <div className="space-y-4">
              {/* Title Dropdown */}

              {/* Description */}
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                className="w-72 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-5 mt-10">
              <button
                onClick={onClose}
                className="border border-green-500 text-green-500 px-10 py-3 rounded-xl hover:bg-green-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-10 py-3 rounded-xl hover:bg-green-600 transition"
              >
                {buttonText}
              </button>
            </div>
          </form>
        </div>
      </Draggable>
    </div>
  );
}

export default UpdateUser
