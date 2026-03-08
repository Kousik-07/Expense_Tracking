import {Router} from "express"
import { getDashboardReport } from "./dashboard.controller.js";
import { userGuird } from "../middleWare/guird.middle.js";
const dashboardRouter = Router()

dashboardRouter.get("/dashboardreport", userGuird, getDashboardReport);

export default dashboardRouter;