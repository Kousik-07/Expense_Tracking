import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import http from "../../utils/http.js";
import { toast } from "react-toastify";
import { mutate } from "swr";


function AddGoal({ title, buttonText, defaultData, onClose }) {
    const nodeRef = useRef(null);
    
    const handelSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target)
            const data = Object.fromEntries(formData.entries())
            await http.post("/api/goal/create", data)
            mutate("/api/goal/get")
            toast.success("Successfully Goal Set")
            onClose()
        } catch (error) {
            toast.error(error)
        }
    }
  return (
    <div>
      <div>
        <Draggable nodeRef={nodeRef} handle=".drag-handel">
          {/* Card Container */}
          <div
            ref={nodeRef}
            className="bg-white w-[90%] md:w-[40%] rounded-2xl p-10 shadow-2xl absolute top-1/2 left-1/2 -translate-1/2 "
          >
            <div className="w-[90%] h-10 absolute top-0 drag-handel "></div>
            {/* Title */}
            <h2 className="text-3xl font-semibold">{title}</h2>
            {/* Form */}
            <form onSubmit={handelSubmit}>
              <div className="space-y-4">
                {/* Title Dropdown */}
                <div className="relative mt-2">
                  <label htmlFor="Ending Date">Ending Date</label>
                  <input
                    type="date"
                    name="date"
                    // defaultValue={defaultData?.date?.slice(0, 10)}
                    className="w-full border rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                {/* Description */}
                <input
                  type="text"
                  name="goalName"
                  //   defaultValue={defaultData?.description}
                  placeholder="Goal Name"
                  className="w-72 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                {/* Category */}
                <select
                  name="category"
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="">All Category</option>
                  <option value="food">Food & Dining</option>
                  <option value="shopping">Shopping</option>
                  <option value="transport">Transportation</option>
                  <option value="salary">Salary</option>
                  <option value="freelance">Freelance Work</option>
                  <option value="bills">Bills & Utilities</option>
                  <option value="health">Health & Fitness</option>
                  <option value="savings">Savings</option>
                </select>

                {/* Amount */}
                <input
                  type="number"
                  name="targetAmount"
                  // defaultValue={defaultData?.amount}
                  placeholder="Target Amount"
                  className="w-52 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
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
    </div>
  );
}

export default AddGoal;
