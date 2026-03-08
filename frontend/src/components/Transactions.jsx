import React, { useMemo, useState } from 'react'
import Add_transactions from './add-pages/Add_transactions';
import useSWR, { mutate } from 'swr'
import fetcher from '../utils/fetcher.js'
import {
  FaUtensils,
  FaShoppingBag,
  FaCar,
  FaMoneyBillWave,
  FaLaptop,
  FaHeartbeat,
  FaPiggyBank,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import http from '../utils/http.js';
import { toast } from 'react-toastify';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from './Shared/Pagination.jsx';

const MySwal = withReactContent(Swal);


function Transactions() {
  const [showAddTrans, setShowAddTrans] = useState(false);
  const [showEditTrans, setShowEditTrans] = useState(false);
  const [editData, setEditData] = useState("");
  //filter--------------------------
  const [dateFilter, setDateFilter] = useState("thisMonth");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("newest");
  const [pageData, setPageData] = useState([]);


  const { data: transections, error } = useSWR(
    "/api/transection/get",
    fetcher
  );
// console.log("DATA =", transections);
// console.log("ERROR =", error);
// console.log(editData);

//filter logic---------------------------
 const filteredTransactions = useMemo(() => {
   if (!transections) return [];

   let data = [...transections];

   const now = new Date();

   // 📅 Date filter
   if (dateFilter === "thisMonth") {
     data = data.filter((t) => {
       const d = new Date(t.date);
       return (
         d.getMonth() === now.getMonth() &&
         d.getFullYear() === now.getFullYear()
       );
     });
   } 

   if (dateFilter === "lastMonth") {
     data = data.filter((t) => {
       const d = new Date(t.date);
       const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
       return (
         d.getMonth() === lastMonth.getMonth() &&
         d.getFullYear() === lastMonth.getFullYear()
       );
     });
   }

   if (dateFilter === "last3Months") {
     data = data.filter((t) => {
       const d = new Date(t.date);
       const sixMonthsAgo = new Date();
       sixMonthsAgo.setMonth(now.getMonth() - 3);
       return d >= sixMonthsAgo && d <= now;
     });
   }
   if (dateFilter === "last6Months") {
     data = data.filter((t) => {
       const d = new Date(t.date);
       const sixMonthsAgo = new Date();
       sixMonthsAgo.setMonth(now.getMonth() - 6);
       return d >= sixMonthsAgo && d <= now;
     });
   }

   if (dateFilter === "thisYear") {
     data = data.filter(
       (t) => new Date(t.date).getFullYear() === now.getFullYear()
     );
   }

   // 🏷 Category filter
   if (categoryFilter) {
     data = data.filter((t) => t.category === categoryFilter);
   }

   // 💰 Type filter
   if (typeFilter) {
     data = data.filter((t) => t.transectionTypes === typeFilter);
   }

   // 🔽 Sorting
   if (sortFilter === "newest") {
     data.sort((a, b) => new Date(b.date) - new Date(a.date));
   }
   if (sortFilter === "oldest") {
     data.sort((a, b) => new Date(a.date) - new Date(b.date));
   }
   if (sortFilter === "amountHigh") {
     data.sort((a, b) => b.amount - a.amount);
   }
   if (sortFilter === "amountLow") {
     data.sort((a, b) => a.amount - b.amount);
   }


   return data;
 }, [transections, dateFilter, categoryFilter, typeFilter, sortFilter]);


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
        await http.delete(`/api/transection/delete/${id}`);

        mutate("/api/transection/get");

        MySwal.fire("Deleted!", "Transaction removed.", "success");
      } catch (error) {
        MySwal.fire("Error!", "Delete failed.", "error");
      }
    }
  };


 const categoryIcons = {
   food: <FaUtensils />,
   shopping: <FaShoppingBag />,
   transport: <FaCar />,
   salary: <FaMoneyBillWave />,
   freelance: <FaLaptop />,
   health: <FaHeartbeat />,
   savings: <FaPiggyBank />,
   bills: <FaFileInvoiceDollar />,
 };

  // const type = editData.type;
  
  return (
    <div className="relative min-h-screen">
      <div className="p-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Transactions</h2>
          <button
            onClick={() => setShowAddTrans(true)}
            className="bg-green-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
          >
            + Add Transaction
          </button>
        </div>
        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border px-4 py-2 rounded-lg text-gray-600"
          >
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="last6Months">Last 6 Months</option>
            <option value="thisYear">This Year</option>
            <option value="all">All Time</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border px-4 py-2 rounded-lg text-gray-600"
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
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border px-4 py-2 rounded-lg text-gray-600"
          >
            <option value="">All Types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
            className="border px-4 py-2 rounded-lg text-gray-600"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amountHigh">Amount: High to Low</option>
            <option value="amountLow">Amount: Low to High</option>
          </select>
        </div>
        {/* TABLE CARD */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="py-4 px-4">Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* ROW */}
              {pageData && pageData.length > 0 ? (
                pageData.map((row) => {
                  return (
                    <tr key={row._id} className="border-b">
                      <td className="py-4 px-4">{row.date?.slice(0, 10)}</td>
                      <td className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-500 text-lg">
                          {categoryIcons[row.category]}
                        </div>
                        {row.category}
                      </td>

                      <td>{row.description}</td>
                      <td>{row.amount}</td>
                      <td>
                        <span
                          className={` px-3 py-1 rounded-full text-sm ${
                            row.transectionTypes === "expense"
                              ? "bg-red-100 text-red-500"
                              : "bg-green-100 text-green-500"
                          }`}
                        >
                          {row.transectionTypes}
                        </span>
                      </td>
                      <td className="flex gap-2 py-3">
                        <button
                          onClick={() => {
                            setShowEditTrans(true);
                            setEditData(row);
                          }}
                          className="bg-yellow-400 p-2 rounded-full"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDelete(row._id)}
                          className="bg-red-500 text-white p-2 rounded-full"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-2xl text-gray-500 py-6"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* PAGINATION */}
        <Pagination
          data={filteredTransactions || []}
          onPageData={setPageData}
        />
      </div>
      {showAddTrans && (
        <Add_transactions
          title="Add Transaction"
          buttonText="Add"
          defaultData={{}}
          onClose={() => setShowAddTrans(false)}
        />
      )}
      ,
      {showEditTrans && transections && (
        <Add_transactions
          title="Edit Transaction"
          buttonText="Edit"
          defaultData={editData}
          onClose={() => setShowEditTrans(false)}
        />
      )}
    </div>
  );
}

export default Transactions
