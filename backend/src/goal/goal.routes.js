import { Router } from "express";
import { userGuird } from "../middleWare/guird.middle.js";
import { createGoal, deleteGoal, getGoal } from "./goal.controller.js";

const goalRouter = Router()

goalRouter.post("/create", userGuird, createGoal);
goalRouter.get("/get",userGuird,getGoal)
goalRouter.delete("/delete/:id", userGuird, deleteGoal);
export default goalRouter