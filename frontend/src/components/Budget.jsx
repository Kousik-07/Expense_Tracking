import React, { useEffect, useMemo, useState } from 'react'
import Setbudget from './budget/Setbudget';
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
import useSWR, { mutate } from 'swr';
import fetcher from '../utils/fetcher.js';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import http from '../utils/http.js';
import Pagination from './Shared/Pagination.jsx';
import ChartLine from './Shared/ChartLine.jsx';
import ChartPie from './Shared/ChartPie.jsx';

const MySwal = withReactContent(Swal);

function Budget() {
  const [showBudgetset, setShowBudgetset] = useState(false);
  const [showEditBudgetset, setShowEditBudgetset] = useState(false);
  const [editData, setEditData] = useState("");
  const [dateFilter, setDateFilter] = useState("thisMonth");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [pageData, setPageData] = useState([]);


  const { data, error } = useSWR(
    "/api/budget/get",
    fetcher
  );
  const budgets = data?.budget 
  const chartData = data?.chart 
  const pieData = data?.pie 
  console.log(pieData);
  


  const { data: spend, mutate: spendreport } = useSWR(
    "/api/budget/spendBudget",
    fetcher
  );

  // console.log(spend);
  
  //filter--------------
  const filteredBudget = useMemo(() => {
    if (!budgets || !spend) return { budgetFilter: [], spendFilter: [] };

    const now = new Date();

    const applyFilter = (arr) => {
      let data = [...arr];

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

      if (dateFilter === "thisYear") {
        data = data.filter(
          (t) => new Date(t.date).getFullYear() === now.getFullYear()
        );
      }

      // 🏷 Category filter
      if (categoryFilter) {
        data = data.filter((t) => t.category === categoryFilter);
      }
      return data;
    };
    // console.log(budgets);

    const budgetFilter = applyFilter(budgets);
    const spendFilter = applyFilter(spend);

    return { budgetFilter, spendFilter };
  }, [budgets, spend, dateFilter, categoryFilter]);

  const { budgetFilter, spendFilter } = filteredBudget;


  

  let Totalbudget = 0;
budgetFilter.forEach((e) => {
    Totalbudget += e.limit;
  });

// console.log(spendFilter);


  let Totalspends = 0;
  filteredBudget.spendFilter.forEach((e) => {
    Totalspends += e.amount;
    
  });

  let remaining = Totalbudget - Totalspends;
  // formatINR(remaining)
  const formatINR = (amount) => {
    let amountINR = amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
    return amountINR;
  };

  const remainingPercent = Totalbudget
    ? 100 - Math.floor((remaining / Totalbudget) * 100)
    : 0;
  
  


  
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
        await http.delete(`/api/budget/delete/${id}`);
        mutate("/api/budget/get");
        mutateReport();
        spendreport();
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

  return (
    <div className="p-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Budget Planner</h2>
          <p className="text-gray-500 text-sm">
            Plan and monitor your monthly limits
          </p>
        </div>
        <button
          onClick={() => setShowBudgetset(true)}
          className="bg-green-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
        >
          + Add New Budget
        </button>
      </div>
      {/* FILTER */}
      <div className="flex gap-4 mb-6">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg text-gray-600"
        >
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
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
      </div>
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Budget</p>
          <h2 className="text-2xl font-bold mt-2">{formatINR(Totalbudget)}</h2>
          <p className="text-green-500 text-sm mt-2">for Oct 2025</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Spent</p>
          <h2 className="text-2xl font-bold mt-2">{formatINR(Totalspends)}</h2>
          <p className="text-red-500 text-sm mt-2">-8%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Remaining</p>
          <h2 className="text-2xl font-bold mt-2">{formatINR(remaining)}</h2>
          <div className="w-full bg-gray-200 h-3 rounded-full mt-3">
            <div
              className="bg-green-500 h-3 rounded-full max-w-full"
              style={{ width: `${remainingPercent}%` }}
            />
          </div>
          <p className="text-xs text-right mt-1 text-gray-500">
            {remainingPercent}% used
          </p>
        </div>
      </div>
      {/* BUDGET TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto mb-8">
        <table className="w-full text-left">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="py-4 px-4">Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Limit</th>
              <th>Spent</th>
              <th>Remaining</th>
              <th>Progress</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* ROW */}
            {pageData && pageData.length > 0 ? (
              pageData.map((row) => {
                // category and date filter ----------
                const categorySpent = spend
                  ? spend.reduce((total, t) => {
                      const spendDate = new Date(t.date);
                      const budgetDate = new Date(row.date);
                      const budgetMonth = budgetDate.getMonth();
                      const budgetYear = budgetDate.getFullYear();

                      const isSameMonth = spendDate.getMonth() === budgetMonth;
                      const isSameYear = spendDate.getFullYear() === budgetYear;
                      const isSameCategory =
                        t.category?.toLowerCase() ===
                        row.category?.toLowerCase();

                      if (isSameMonth && isSameYear && isSameCategory) {
                        return total + (Number(t.amount) || 0);
                      }
                      return total;
                    }, 0)
                  : 0;
                // ----------------------------------------------------

                const remainingPercentlimit = row.limit
                  ? 100 -
                    Math.floor(((row.limit - categorySpent) / row.limit) * 100)
                  : 0;

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
                    <td>{formatINR(row.limit)}</td>
                    <td>{formatINR(categorySpent)}</td>
                    <td>{formatINR(row.limit - categorySpent)}</td>
                    <td>
                      <div className="bg-gray-200 h-3 rounded-full">
                        <div
                          className="bg-green-500 h-3 rounded-full max-w-full"
                          style={{ width: `${remainingPercentlimit}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {remainingPercentlimit}% used
                      </p>
                    </td>
                    <td className="flex gap-2 justify-center py-3">
                      <button
                        onClick={() => {
                          setShowEditBudgetset(true);
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
                  colSpan="8"
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
      <Pagination data={filteredBudget.budgetFilter} onPageData={setPageData} />
      {/* INSIGHTS */}
      <h3 className="text-xl font-semibold mb-4">Budget Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h4 className="font-semibold mb-3">Budget vs Spending Over Time</h4>
          <div className="h-90 w-full border flex items-center justify-center text-gray-400 rounded">
            <ChartLine
              transectionchart={chartData}
              dataKey1="budget"
              dataKey2="spending"
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h4 className="font-semibold mb-3">
            Category-wise Budget Allocation
          </h4>
          <div className="h-90 border flex items-center justify-center text-gray-400 rounded">
            <ChartPie
              data={pieData}
              dataKey2={pieData?.value}
              dataKey1={pieData?.name}
            />
          </div>
        </div>
      </div>
      {showBudgetset && (
        <Setbudget
          title="Add Budget"
          buttonText="Add"
          defaultData={{}}
          onClose={() => setShowBudgetset(false)}
        />
      )}
      {showEditBudgetset && (
        <Setbudget
          title="Edit Budget"
          buttonText="Edit"
          defaultData={editData}
          onClose={() => setShowEditBudgetset(false)}
        />
      )}
    </div>
  );
}

export default Budget
