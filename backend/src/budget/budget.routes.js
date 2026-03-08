import { Router } from "express";
import { createBudget, deleteBudget, getBudget, spendBudget, updateBudget } from "./budget.controller.js";
import { userGuird } from "../middleWare/guird.middle.js";

const budgerRouter = Router()
budgerRouter.post("/create", userGuird,createBudget);
budgerRouter.put("/update/:id", userGuird,updateBudget);
budgerRouter.delete("/delete/:id", userGuird,deleteBudget);
budgerRouter.get("/get", userGuird,getBudget);
// budgerRouter.get("/budgetreport", userGuird, budgetReport);
budgerRouter.get("/spendBudget", userGuird, spendBudget);

export default budgerRouter
