import { Router } from "express";
import { createTransection, deleteTransection, getTransection, updateTransection } from "./transaction.controller.js";
import { userGuird } from "../middleWare/guird.middle.js";

const transactionRouter = Router()
transactionRouter.post("/create", userGuird, createTransection);
transactionRouter.put("/update/:id", userGuird, updateTransection);
transactionRouter.delete("/delete/:id", userGuird, deleteTransection);
transactionRouter.get("/get", userGuird, getTransection);

export default transactionRouter;