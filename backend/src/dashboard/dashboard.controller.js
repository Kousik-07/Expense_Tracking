import transectionData from "../transactions/transaction.model.js"
import mongoose from "mongoose";
export const getDashboardReport = async (req, res) => {
    try {
        const { id } = req.user
        const transection = await transectionData.find({
            userId: id
        }).lean();
        // console.log(transection);
        let totalIncome = 0
        let totalExpence = 0
        let thisMonthTotalIncome = 0
        let thisMonthTotalExpence = 0
        let lastMonthTotalIncome = 0
        let lastMonthTotalExpence = 0
        
        
        transection.forEach((txn) => {
            if (txn.transectionTypes === "income") {
                totalIncome += txn.amount;
            }
            else if (txn.transectionTypes === "expense") {
                totalExpence += txn.amount;
            }
        });
        //total Balance--------------
let totalBalance = totalIncome - totalExpence;
        let data = [...transection]
        const now = new Date();
         data = transection.filter((t) => {
             const d = new Date(t.date);
             return (
               d.getMonth() === now.getMonth() &&
               d.getFullYear() === now.getFullYear()
             );
        }
         );
        
        
        
        let preMonthData=[...transection]
        preMonthData = preMonthData.filter((t) => {
          const d = new Date(t.date);
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return (
            d.getMonth() === lastMonth.getMonth() &&
            d.getFullYear() === lastMonth.getFullYear()
          );
        });

        preMonthData.forEach((txn) => {
          if (txn.transectionTypes === "income") {
            lastMonthTotalIncome += txn.amount;
          } else if (txn.transectionTypes === "expense") {
            lastMonthTotalExpence += txn.amount;
          }
        });
        
       data.forEach((txn) => {
           if (txn.transectionTypes === "income") {
                thisMonthTotalIncome += txn.amount;
            }
            else if (txn.transectionTypes === "expense") {
                thisMonthTotalExpence += txn.amount;
            }
       })
        let thisMonthBal = thisMonthTotalIncome - thisMonthTotalExpence;
      let incomeRate = lastMonthTotalIncome
         ? Math.floor(
             ((thisMonthTotalIncome - lastMonthTotalIncome) /
               lastMonthTotalIncome) *
               100
           )
           : 0;
        
      let expenseRate = lastMonthTotalExpence?Math.floor(
             ((thisMonthTotalExpence - lastMonthTotalExpence) /
               lastMonthTotalExpence) *
               100
           )
           : 0;
        
        let savingsRate = totalIncome
          ? Math.floor(((totalIncome - totalExpence) / totalIncome) * 100)
          : 0;

        let thisMonthSavings = thisMonthTotalIncome - thisMonthTotalExpence;
        let thisMonthRate= Math.floor((thisMonthSavings / thisMonthTotalIncome)*100)


           let LastMonthSavings = lastMonthTotalIncome- lastMonthTotalExpence
            let LastMonthRate= Math.floor((LastMonthSavings / lastMonthTotalIncome)* 100)
      let improvement = thisMonthRate - LastMonthRate
      
      const report = await transectionData.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(id) } },
        {
          $addFields: {
            
            convertedDate: { $toDate: "$date" },
          },
        },
        {
          $group: {
            _id: {
             
              month: { $month: "$convertedDate" },
              year: { $year: "$convertedDate" },
            },
            
            totalincome: {
              $sum: {
                $cond: [{ $eq: ["$transectionTypes", "income"] }, "$amount", 0],
              },
            },
            totalexpense: {
              $sum: {
                $cond: [
                  { $eq: ["$transectionTypes", "expense"] },
                  "$amount",
                  0,
                ],
              },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }, // ক্রমানুসারে সাজানো
      ]);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const formattedData = report.map(item => ({
      name: monthNames[item._id.month - 1], // মাসের নাম্বার থেকে নাম নেওয়া
      income: item.totalincome,
      expense: item.totalexpense
    }));
      //pie chart data
      const pieChart = await transectionData.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(id),
            transectionTypes: "expense",
          },
        },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            value: 1,
          },
        },
      ]);
      //top 5 expenses
      const topPieChart = await transectionData.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(id),
            transectionTypes: "expense",
          },
        },
        {
          $sort: {
            amount:-1
          },
        },
        {$limit:5},
        {
          $project: {
            _id: 1,
            category:1,
            amount: 1,
          },
        },
      ]);
      


        res.status(200).json({
          summary: {
            totalIncome,
            totalExpence,
            totalBalance,
            thisMonthBal,
            incomeRate,
            expenseRate,
            savingsRate,
            improvement,
          },
          chart: {
            formattedData,
            pieChart,
            topPieChart,
          },
        });
    }    
     catch (error) {
        res.status(500).json({
            message:error.message || "internal server problem"
        })
    }
}