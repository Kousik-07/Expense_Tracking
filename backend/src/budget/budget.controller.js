import mongoose from "mongoose";
import transectionData from "../transactions/transaction.model.js";
import budgetData from "./budget.model.js";

//create budget------------------------
export const createBudget = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.user;
        data.userId = id;

        const budget = await new budgetData(data).save()
        res.json(budget)
    } catch (error) {
         res
           .status(500)
           .json({ message: error.message || "Internal server problem" });
    }
}

//update budget------------------------
export const updateBudget = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.params;

        const budget = await budgetData.findByIdAndUpdate(id,data,{new:true})
        res.json(budget)
    } catch (error) {
         res
           .status(500)
           .json({ message: error.message || "Internal server problem" });
    }
}

//delete budget------------------------
export const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params;

        const budget = await budgetData.findByIdAndDelete(id)
        res.json(budget)
    } catch (error) {
         res
           .status(500)
           .json({ message: error.message || "Internal server problem" });
    }
}

//get budget------------------------
export const getBudget = async (req, res) => {
    try {
      const { id } = req.user;
      const databudget = await budgetData.find({ userId: id })
      const chartData = await budgetData.aggregate([
        // 1. Match specific User
        { $match: { userId: new mongoose.Types.ObjectId(id) } },

        // 2. Budget theke month ar year extract kora
        {
          $project: {
            month: { $dateToString: { format: "%b", date: "$date" } }, // 'Jan', 'Feb' etc
            monthNum: { $month: "$date" },
            year: { $year: "$date" },
            limit: 1,
          },
        },

        // 3. Month ar Year onujayi group kora (Budget sum kora)
        {
          $group: {
            _id: { month: "$month", monthNum: "$monthNum", year: "$year" },
            totalBudget: { $sum: "$limit" },
          },
        },

        // 4. Transaction table theke data ana (userId logic shoho)
        {
          $lookup: {
            from: "transections", // Database collection-er exact nam check korbe
            let: { b_month: "$_id.month", b_year: "$_id.year" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$userId", new mongoose.Types.ObjectId(id)] }, // Transaction-eo user check kora
                      {
                        $eq: [
                          { $dateToString: { format: "%b", date: "$date" } },
                          "$$b_month",
                        ],
                      },
                      { $eq: [{ $year: "$date" }, "$$b_year"] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  totalSpent: { $sum: "$amount" },
                },
              },
            ],
            as: "spendingData",
          },
        },

        // 5. Final structure create kora
        {
          $project: {
            _id: 0,
            name: "$_id.month",
            year: "$_id.year",
            budget: "$totalBudget",
            spending: {
              $ifNull: [{ $arrayElemAt: ["$spendingData.totalSpent", 0] }, 0],
            },
            monthNum: "$_id.monthNum",
          },
        },

        // 6. Sorting
        { $sort: { year: 1, monthNum: 1 } },
      ]);

      const pieChart = await budgetData.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $group: {
            _id: "$category",
            value:{$sum:"$limit"}
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            value:1
          }
        }
      ]);
      res.json({
        success: true,
        budget: databudget,
        chart: chartData,
        pie:pieChart,
      });
      // console.log(budgetData);
      
    } catch (error) {
         res
           .status(500)
           .json({ message: error.message || "Internal server problem" });
    }
}



//spend budget---------
export const spendBudget = async (req, res) => {
    try {
      const { id } = req.user;
      const transaction = await transectionData
        .find({
          userId: id,
        })
        .lean();
      
        const expenceData = transaction.filter((e) => e.transectionTypes==="expense");
      
      res.status(200).json(expenceData);
    } catch (error) {
        res.status(500).json({
          message: error.message || "internal server problem",
        });
    }
}



