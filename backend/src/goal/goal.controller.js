import mongoose from "mongoose";
import goalData from "./goal.model.js";

//create goal-------------------
export const createGoal = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.user;
        data.userId = id;
        const goal = await new goalData(data).save()
        res.json(goal)
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
        
    }
}

//get goal data------------------
export const getGoal = async (req, res) => {
    try {
        const { id } = req.user
        const dataGoal = await goalData
          .find({ userId: id })
          .sort({ createdAt: -1 });
       res.json(dataGoal)
        
    } catch (error) {
        res.status(500).json(error)
    }
}

//delete goal data------------------------
export const deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const goal = await goalData.findByIdAndDelete(id)
        res.json(goal)
    } catch (error) {
        res.status(500).json({message:error.message||"Internal server problem"})
    }
}