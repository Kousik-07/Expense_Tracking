import React, { useEffect, useState } from 'react'
import http from '../utils/http.js'
import ChartLine from './Shared/ChartLine.jsx';
import ChartPie from './Shared/ChartPie.jsx';

function Home() {
  const [report, setReport] = useState(null)
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await http.get("/api/dashboard/dashboardreport");
        setReport(res.data);
        console.log(res);
        
      } catch (err) {
        console.error(err.message);
      } 
    };

    fetchReport();
  },[])

  
  
  const summary = report?.summary
  const chart = report?.chart.formattedData;
  const piechart = report?.chart.pieChart;
console.log(piechart);


  const isIncomeUp = summary?.incomeRate >= 0;
  const isExpenceUp = summary?.expenseRate >= 0;
  const isImprovementUp = summary?.improvement >= 0;

 

  return (
    <div>
      <div className="p-10">
        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Balance</p>
            <h2 className="text-2xl font-bold mt-2">
              ₹{summary?.totalBalance}
            </h2>
            <p className="text-green-500 text-sm mt-2">
              ₹{summary?.thisMonthBal} this month
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Income</p>
            <h2 className="text-2xl font-bold mt-2">₹{summary?.totalIncome}</h2>
            <p
              className={
                isIncomeUp
                  ? "text-green-500 text-sm mt-2"
                  : "text-red-500 text-sm mt-2"
              }
            >
              {isIncomeUp ? "+" : ""}
              {summary?.incomeRate}% from last month
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Expense</p>
            <h2 className="text-2xl font-bold mt-2">
              ₹{summary?.totalExpence}
            </h2>
            <p
              className={
                isExpenceUp
                  ? "text-green-500 text-sm mt-2"
                  : "text-red-500 text-sm mt-2"
              }
            >
              {isExpenceUp ? "+" : ""}
              {summary?.expenseRate}% from last month
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Savings Rate</p>
            <h2 className="text-2xl font-bold mt-2">{summary?.savingsRate}%</h2>
            <p
              className={
                isImprovementUp
                  ? "text-green-500 text-sm mt-2"
                  : "text-red-500 text-sm mt-2"
              }
            >
              {isImprovementUp ? "+" : ""}
              {summary?.improvement}% improvement
            </p>
          </div>
        </div>
        {/* OVERVIEW */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-5">Spending Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GRAPH PLACEHOLDER */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-3">Income vs Expense</h3>
              <div className="h-90 w-full flex items-center justify-center  border rounded-lg">
                <ChartLine
                  transectionchart={chart}
                  dataKey1="income"
                  dataKey2="expense"
                />
              </div>
            </div>
            {/* PIE PLACEHOLDER */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-3">Expense Breakdown</h3>
              <div className="h-90 flex items-center justify-center text-gray-400 border rounded-lg">
                <ChartPie
                  data={piechart}
                  dataKey1={piechart?.name}
                  dataKey2={piechart?.value}
                />
              </div>
            </div>
          </div>
        </div>
        {/* TRANSACTIONS */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Recent Transactions</h3>
            <a href="#" className="text-blue-500 text-sm">
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="pb-3">Transaction</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">Netflix Subscription</td>
                  <td>Entertainment</td>
                  <td>10 Oct 2025</td>
                  <td className="text-red-500">-₹499</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Salary Credit</td>
                  <td>Income</td>
                  <td>07 Oct 2025</td>
                  <td className="text-green-500">+₹25,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Zomato Order</td>
                  <td>Food</td>
                  <td>05 Oct 2025</td>
                  <td className="text-red-500">-₹289</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Uber Ride</td>
                  <td>Travel</td>
                  <td>03 Oct 2025</td>
                  <td className="text-red-500">-₹180</td>
                </tr>
                <tr>
                  <td className="py-3">Freelance Payment</td>
                  <td>Income</td>
                  <td>02 Oct 2025</td>
                  <td className="text-green-500">+₹5,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home
