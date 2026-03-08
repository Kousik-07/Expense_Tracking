import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import http from '../../utils/http'
import { mutate } from 'swr'
import { toast } from 'react-toastify'
function Setbudget({ title, buttonText, defaultData, onClose }) {
  const nodeRef = useRef(null);
  const [category, setCategory] = useState("");
  
  useEffect(() => {
   if (defaultData?.category) {
    setCategory(defaultData.category)
   }
 },[defaultData])

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      if (buttonText === "Add") {
        await http.post("/api/budget/create", data);
        mutate("/api/budget/get");
        mutate("/api/budget/budgetreport");
        toast.success("Budget set successfully");
      } else {
        await http.put(`/api/budget/update/${defaultData._id}`, data);
        mutate("/api/budget/get");
        mutate("/api/budget/budgetreport");
        toast.success("Budget updated successfully");
        console.log("edit id:", defaultData._id);
        console.log("Data:", data);
        
      }
      onClose();
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
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  defaultValue={defaultData?.date?.slice(0,10)}
                  className="w-full border rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              {/* Description */}
              <input
                type="text"
                name="description"
                defaultValue={defaultData?.description}
                placeholder="Enter Description"
                className="w-72 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {/* Category */}
              <select
                value={category}
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
                name="limit"
                defaultValue={defaultData?.limit}
                placeholder="Budget Limit(₹)"
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
  );
}

export default Setbudget;
