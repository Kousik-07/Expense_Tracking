import React, { useEffect, useMemo, useState } from 'react'
import http from '../utils/http';
import ChartLine from './Shared/ChartLine';
import ChartBar from './Shared/ChartBar';
import ChartPie from './Shared/ChartPie';
import useSWR from 'swr';
import fetcher from '../utils/fetcher';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


function Reports() {
  const [report, setReport] = useState(null);
  const [dateFilter, setDateFilter] = useState("thisMonth");
  const [sortFilter, setSortFilter] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("");
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
    }, []);
  const chart = report?.chart.formattedData;
  const barChart = report?.chart.pieChart;
  const topChart = report?.chart.topPieChart;

  const { data: transections, error } = useSWR(
    "/api/transection/get",
    fetcher
  );

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

     if (dateFilter === "last6Months") {
       data = data.filter((t) => {
         const d = new Date(t.date);
         const sixMonthsAgo = new Date();
         sixMonthsAgo.setMonth(now.getMonth() - 6);
         return d >= sixMonthsAgo && d <= now;
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

     if (dateFilter === "thisYear") {
       data = data.filter(
         (t) => new Date(t.date).getFullYear() === now.getFullYear()
       );
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

     if (typeFilter) {
       data = data.filter((t) => t.transectionTypes === typeFilter);
     }

     return data;
   }, [transections, dateFilter, sortFilter, typeFilter]);

  console.log(filteredTransactions);
  
  //PDF Export-------------------------------------
  const handleDownloadPDF = () => {
    if (!filteredTransactions) {
      alert("No data found")
    }
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Expense and Income Report", 14, 15);
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
      doc.setFontSize(22)
      doc.text("Fin", 150, 15);
      doc.setFontSize(30)
      doc.setTextColor(76,175,80)
      doc.text("Track", 159, 15);
      

      const tableRow = filteredTransactions.map((item) => [
        item.date ? new Date(item.date).toLocaleDateString() : "N/A",
        item.category,
        `${item.amount} RS`,
        item.transectionTypes.toUpperCase(),
      ]);

     autoTable(doc,{
        startY: 30,
        head: [["Date", "Category", "Amount", "Type"]],
        body: tableRow,
        theme: "striped",
        headStyles: { fillColor: [0, 136, 254] }, // আপনার চার্টের সাথে মিল রেখে কালার
      });
      doc.save("report.pdf");
      console.log("pdf download");
      
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Something went wrong while generating PDF.");
    }
  };

  return (
    <div className="p-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Reports / Analytics</h2>
        <button
          onClick={handleDownloadPDF}
          className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
        >
          Export
        </button>
      </div>
      {/* FILTERS */}
      <div className="flex gap-4 mb-8">
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
          value={sortFilter}
          onChange={(e) => setSortFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg text-gray-600"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amountHigh">Amount: High to Low</option>
          <option value="amountLow">Amount: Low to High</option>
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
      </div>
      {/* FINANCIAL OVERVIEW */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Financial Overview</h3>
      </div>
      {/* CHART GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Income vs Expense */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between mb-3">
            <h4 className="font-semibold">Income vs Expense</h4>
            <span className="text-sm text-gray-400">Monthly trend</span>
          </div>
          <div className="h-64 md:h-90 border rounded flex items-center justify-center text-gray-400">
            <ChartLine
              transectionchart={chart}
              dataKey1="income"
              dataKey2="expense"
            />
          </div>
        </div>
        {/* Spending by Category */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h4 className="font-semibold mb-3">Spending by Category</h4>
          <div className="h-64 md:h-90  border rounded flex items-center justify-center text-gray-400">
            <ChartBar data={barChart} dataKeyX="name" dataKeyY="value" />
          </div>
        </div>
      </div>
      {/* TOP EXPENSES */}
      <div className="bg-white p-6 rounded-xl shadow w-full md:w-1/2">
        <h4 className="font-semibold mb-3">Top 5 Expenses</h4>
        <div className="h-64 md:h-90 border rounded flex items-center justify-center text-gray-400">
          <ChartPie data={topChart} dataKey1="category" dataKey2="amount" />
        </div>
      </div>
    </div>
  );
}

export default Reports
