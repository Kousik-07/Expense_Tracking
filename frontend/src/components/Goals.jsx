import React, { useState } from 'react'
import AddGoal from './goal-add/AddGoal';
import useSWR, { mutate } from 'swr';
import fetcher from '../utils/fetcher.js';
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import http from '../utils/http.js';
const MySwal = withReactContent(Swal);
function Goals() {

  const [showAddGoal, setShowAddGoal] = useState(false);


  const { data:Goaldata, error } = useSWR(
    "/api/goal/get",
    fetcher
  )
  const { data: totalSaving, errors } = useSWR(
    "/api/dashboard/dashboardreport",
    fetcher
  )
  const TotalSaving = totalSaving?.summary.totalBalance;
  //delete function
 const onDelete = async (id) => {
   const result = await MySwal.fire({
     title: "Are you sure?",
     text: "You won't be able to recover this!",
     icon: "warning",
     showCancelButton: true,
     confirmButtonColor: "#ef4444",
     cancelButtonColor: "#6b7280",
     confirmButtonText: "Yes, delete it!",
   });

   if (result.isConfirmed) {
     try {
       await http.delete(`/api/goal/delete/${id}`);
       mutate("/api/goal/get");
       MySwal.fire("Deleted!", "Transaction removed.", "success");
     } catch (error) {
       MySwal.fire("Error!", "Delete failed.", "error");
     }
   }
 };
  
  

    // console.log(TotalSaving);
  
  return (
    <div className="p-10 min-h-170 overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Goal Set</h2>
          <p className="text-gray-500 text-sm">
            Set, track, and achieve your financial targets
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddGoal(true);
          }}
          className="bg-green-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
        >
          + Add Goal
        </button>
      </div>

      {/* GOAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* CARD */}
        {Goaldata && Goaldata.length > 0 ? (Goaldata.map((row) => {
          const percentage = Math.floor((TotalSaving / row.targetAmount) * 100);
          const currentState=percentage>=100?"Completed":"Ongoing"
          return (
            <div key={row._id} className="bg-white p-6 rounded-xl shadow relative">
              <div onClick={()=>onDelete(row._id)} className="absolute right-5 text-2xl text-red-300 hover:text-red-400 active:text-red-600">
                <MdDeleteForever />
              </div>
              <h3 className="font-semibold mb-1">{row.goalName}</h3>
              <p className="text-sm text-gray-500 mb-3">
                ₹{row.targetAmount} Target | ₹{TotalSaving} Saved
              </p>
              <div className="bg-gray-200 h-3 rounded-full mb-2">
                <div
                  className="bg-green-500 h-3 rounded-full max-w-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-3">
                <span />
                <span>{percentage}%</span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`${
                    currentState === "Completed"
                      ? "bg-green-500 text-white"
                      : "bg-green-100 text-green-600"
                  } px-3 py-1 rounded-full text-xs`}
                >
                  {currentState}
                </span>
                <span className="text-xs">
                  Complete Between{" "}
                  <span className="text-sm text-red-400">
                    {row.date.slice(0, 10)}
                  </span>
                </span>
              </div>
            </div>
          );
        })) : (
            <div className="text-center w-screen text-3xl mt-10">No  found</div>
        )}
        
      </div>
      {showAddGoal && (
        <AddGoal
          title="Set Your Goal"
          buttonText="Add"
          defaultData="new"
          onClose={() => setShowAddGoal(false)}
        />
      )}

      
    </div>
  );
}

export default Goals
